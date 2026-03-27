# Redes (Networking)

## Configuración y diagnóstico de interfaces y conexiones.

```bash
ip a
```

Muestra información de las interfaces de red, estados y direcciones IP (Recomendado sobre `ifconfig`).

```bash
ifconfig
```

Herramienta clásica para ver y configurar adaptadores de red (requiere `apt install net-tools`).

```bash
ip link set dev eth0 promisc on
```

Establece la interfaz eth0 en modo promiscuo (capta todo el tráfico del segmento).

```bash
ip addr add 10.0.0.100/24 dev eth2
```

Asigna una dirección IP y máscara a una interfaz de red específica.

```bash
ip addr del <IP/máscara> dev <interfaz>
```

Elimina la dirección IP asignada a una interfaz.

```bash
ip route show
```

Muestra la tabla de enrutamiento del sistema (puerta de enlace, rutas estáticas).

```bash
ip neighbor show
```

Muestra la tabla ARP, es decir, los vecinos de red y sus direcciones MAC.

```bash
ping <host>
```

Envía paquetes ICMP para comprobar la conectividad con otro equipo.

```bash
ss -tunlp
```

Muestra los puertos abiertos y las conexiones activas (reemplaza al antiguo `netstat`).
