---
title: "Dev Notes: Using tshark with nRF Util Bluetooth Sniffer"
description: 'How to capture using the Wiresharks tshark CLI'
pubDate: 'November 30 2024'
---

Over the past few months I have launched a foray into Bluetooth. Specifically, reverse engineering a BLE protocol for an IoT device in order to interop it with Home Assistant.

To this end, I have been using my [nRF52840](https://www.nordicsemi.com/Products/nRF52840) Bluetooth Sniffer with Wireshark.

As part of that I want to create some simple scripts in order to automate the process of extracting a unique key over the air for the device in question.

The most obvious way to script this is to use [`tshark`](https://www.wireshark.org/docs/man-pages/tshark.html) on the CLI alongside some filters and JSON output. This turned out to be more irritating than expected due to conflicting info online and recent entirely rewritten versions of the nRF Wireshark integration. After some experimentation, I can confirm a few things.

# nRF Software Packages

First you need to understand what nRF software you are using to perform the sniffing. There are effectively two official parallel software packages to do this at the time of writing, as Nordic are currently rebuilding their tooling ecosystem.

Confusingly, each option appears with the same name at various points in the documentation, yet the versioning scheme for them is completely different and they are built on different technologies. They don't currently mention each other in each of their own docs.

* The **old** python-based [*nRF Sniffer for Bluetooth LE*](https://www.nordicsemi.com/Products/Development-tools/nRF-Sniffer-for-Bluetooth-LE).
* The **new** [*nRFUtil BLE Sniffer*]([nrfutil-ble-sniffer](https://docs.nordicsemi.com/bundle/nrfutil/page/nrfutil-ble-sniffer/nrfutil-ble-sniffer_0.12.0.html)).

*nRFUtil* is the new CLI for everything nRF. The BLE sniffer software is integrated with it (after [installing the subcommand for it](https://docs.nordicsemi.com/bundle/nrfutil/page/nrfutil-ble-sniffer/guides/installing_nrf_sniffer.html)).

Both software packages ultimately add [`extcap`](https://www.wireshark.org/docs/man-pages/extcap.html) interfaces to Wireshark. But the interface installed by the new *nRFUtils* CLI is now a Rust based binary that calls back into some other binaries that are downloaded when you install the sniffer commands.

If you are wanting to build something on top of these tools that works moving forward, it's probably a good idea to use the new *nRFUtil* package.

# Scripting packet capture

In my use case I want to simply script live packet capture by processing some representation of those packets over stdin. I want to perform some tasks inside of the local system shell,not just on unix shells, but also including Powershell for Windows platforms.

Both options have constraints and technicalities that influence the details.


## With Python extcap plugin

If you are still using the old Python sniffer, there's nothing out of the ordinary to consider.

You have no real option beyond `tshark` since all you have here is the Wireshark extcap plugin to integrate with your nRF hardware.

Thankfully `tshark` just works as you'd expect with a live capture directly on the interface.

For example, to output JSON if my sniffer is on interface `1`:

```
tshark -i 1 -l -T json
```

## With nRFUtil

The new tooling presents some more options, but also some curious challenges.

### Can we use the stdout of the CLI?

The nRFUtil CLI already ships with a promising looking [`sniff` command](https://docs.nordicsemi.com/bundle/nrfutil/page/nrfutil-ble-sniffer/nrfutil-ble-sniffer_0.12.0.html) that we could use instead of `tshark`.

```
 nrfutil --log-output=stdout --log-level=debug --json ble-sniffer sniff --port <com-port>
 ```

However, at the time of writing the JSON output provided by this is mostly debug related. There *is* some packet information that can be accessed amongst it, but it is not serialised in an easy-to-parse way as it was clearly not intended for using in an actual pipeline like this.

Rather, it outputs the structured data into a PCAP file in the same directory, or a file specified by `--output-pcap-file <path>`.

### Can we simply listen to the interface with `tshark`?

Unfortunately just firing off `tshark` with the latest version of the extcap plugin (at the time of writing) installed by `nrfutil ble-sniffer bootstrap` does not work out of the box:

```
Capturing on 'nRF Sniffer for Bluetooth LE COM6'
    1   0.000000 xx:xx:xx:xx:xx:xx → Broadcast    LE LL 63  ADV_NONCONN_IND
    2   0.000563 xx:xx:xx:xx:xx:xx → Broadcast    LE LL 63  ADV_NONCONN_IND
    3   0.009282 xx:xx:xx:xx:xx:xx → Broadcast    LE LL 63  ADV_IND
    4   0.010509 xx:xx:xx:xx:xx:xx → Broadcast    LE LL 60  ADV_SCAN_IND
4 packets captured
```

The capture abruptly ends with no error state very briefly after it starts capturing. No amount of deep exploration of `tshark` flags was able to resolve this issue.

After using Process Explorer to see how worked within the Wireshark GUI, I can see it executes the extcap binary, which in turn executes the core binary of the sniffer within nRFUtils. 

That same core binary is also used as a child process to `nrfutil` when using the `sniff` command directly on the CLI.

I suspect that there is some idiosyncrasies in the implementation such that these core binaries are reliant on something from the supported host processes, and `tshark` does not fulfill those (currently unknown) conditions. 

This is not too surprising considering `tshark` is not officially supported, but I wont let that stop me.

### Workaround

So for now, we can workaround this issue by piping the PCAP file produced by the `sniff` command to `tshark` and tailing it too in order to get the data on a live capture.

#### Windows

Astonishingly Powershell 5, which Windows ships with, has no easy way of piping binary files into stdin. 

I played around with chunking the data to work around this but `tshark` crashes, most likely because the chunk boundaries are not on packet boundaries, meaning the input is corrupt.

Things are much easier if you install Powershell 7 and access its shell via `pwsh`. That gives access to [`-AsByteStream`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-content?view=powershell-7.4#-asbytestream) which makes things a lot easier.

```
 nrfutil ble-sniffer sniff --port <com-port> --output-pcap-file capture.pcap
 Get-Content capture.pcap -AsByteStream -Wait | .\tshark.exe -l -T json -r -
```
