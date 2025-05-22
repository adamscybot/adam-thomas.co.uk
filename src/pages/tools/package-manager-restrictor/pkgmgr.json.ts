/**
 * Vercel ISR is active on this route so we don't ever request the things we need from the npm repository more
 * than once across the whole applications history (including across multiple deploys) unless the cache has been
 * triggered to manually refresh via the bypass token. I have setup external webhooks that listen for updates to the
 * relevant packages and tell Vercel to refresh the ISR cache.
 * 
 * I want ISR here because I want my portfolio to be ultra-fast and so hanging on the (quite slow) calls to the npm repository
 * to fetch the versions of certain packages for use in this tool doesn't meet my UX goals.
 */

export const prerender = false

const MIRRORS = [
  'https://registry.npmjs.org',
  'https://registry.yarnpkg.com',
] as const

function promiseWithTimeout<T>(
  promiseArg: Promise<T>,
  timeoutMS: number,
): Promise<T> {
  let timeout: NodeJS.Timeout
  const timeoutPromise = new Promise<never>((resolve, reject) => {
    timeout = setTimeout(() => {
      reject(new Error(`Timed out after ${timeoutMS} ms.`))
    }, timeoutMS)
  })

  return Promise.race([promiseArg, timeoutPromise]).finally(() =>
    clearTimeout(timeout),
  )
}

const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn'] as const

type PkgMgr = (typeof PACKAGE_MANAGERS)[number]

function assertIsRepoManifest(
  json: any,
): asserts json is Record<string, any> & { versions: Record<string, any> } {
  if (
    !('versions' in json) ||
    typeof json.versions !== 'object' ||
    Array.isArray(json.versions) ||
    json.versions === null
  ) {
    throw new Error(`Invalid repo manifest json: ${json}`)
  }
}

const getRepoManifest = async (pkgName: PkgMgr) => {
  for (let mirror of MIRRORS) {
    try {
      const url = `${mirror}/${pkgName}`
      const resp = await promiseWithTimeout(fetch(url), 10000)
    
      if (!resp.ok) {
        throw new Error(`Couldnt fetch manifest: ${url}`)
      }
    
      const json = await resp.json()

      assertIsRepoManifest(json)
      return { [pkgName]: Object.keys(json.versions).reverse() }
    } catch(e) {
      console.log(e)
      continue
    }
  }

  throw new Error(`Couldn't fetch repo manifest for ${pkgName}`)
}

export async function GET() {
  console.log("Triggered fetch of package manager manifests")
  return new Response(
    JSON.stringify(
      Object.assign(
        {},
        ...(await Promise.all(PACKAGE_MANAGERS.map(getRepoManifest))),
      ),
    ), {headers: {'content-type': 'application/json'}} )
}
