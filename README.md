# ipv6-simple-calc

ipv6-simple-calc is a lightweight, client‑side tool that takes an IPv6 address and prefix length and computes the corresponding network information. It is designed both as a practical calculator and as a learning aid for understanding IPv6 addressing, subnetting, and prefix manipulation.

The calculator accepts a standard IPv6 address in compressed or expanded form, along with a prefix length (for example /64). An optional second prefix allows you to explore subnetting or supernetting scenarios by instantly recalculating the resulting networks.

Unlike IPv4, IPv6 does not use broadcast addresses or classful networks, but the underlying structure is still visible when you examine the binary representation of the address. The calculator highlights the boundary between the network portion and the host portion of the address, making it easier to understand how prefixes shape IPv6 networks.

You can experiment with different prefix lengths to see how the network address, host range, and subnet structure change. When generating subnets, the newly introduced network bits are clearly shown so you can visualize how the address space is being divided.

The tool runs entirely in the browser and requires no backend or database. It is intended to be simple, fast, and educational — a small utility for anyone learning IPv6 or working with address planning.