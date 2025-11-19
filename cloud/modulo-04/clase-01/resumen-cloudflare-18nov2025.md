# Resumen del Apagón Global de Cloudflare — 18 de Noviembre de 2025

Este documento resume el incidente global causado por Cloudflare el **18 de noviembre de 2025**, incluyendo explicación técnica, línea de tiempo y referencias oficiales.

---

## 1. Resumen del incidente

- Gran parte de Internet presentó errores **5xx de Cloudflare** al cargar sitios y APIs.
- La causa raíz fue un **archivo de configuración de Bot Management** generado incorrectamente a partir de un cambio en una consulta de **ClickHouse**, lo que produjo un archivo demasiado grande.
- Ese archivo sobrepasó un límite interno y provocó un **panic en el proxy de Cloudflare**, afectando al CDN, WAF, Workers KV, Access, Turnstile y múltiples servicios web globales.
- No fue un ataque ni una brecha de datos.
- Cloudflare maneja ~20% del tráfico web mundial, por lo que la caída tuvo alcance global.

---

## 2. Línea de tiempo del incidente (UTC)

### 11:05 — Cambio en ClickHouse
Un ajuste de permisos en ClickHouse alteró la consulta que genera el archivo de características de Bot Management. Este comenzó a producir **columnas duplicadas** y un tamaño muy superior al esperado.

Referencia: Blog oficial (sección “The query behaviour change”).  
https://blog.cloudflare.com/18-november-2025-outage/

### 11:20–11:28 — Inicio de errores globales
El archivo inflado se distribuye en la red. Al cargarse, el módulo de Bot Management supera el límite técnico establecido, provocando un **panic en el proceso del proxy**, devolviendo errores 5xx masivos.

### 11:31–11:48 — Detección del incidente
Los sistemas automáticos detectan fallas; se declara el incidente. Inicialmente parece que Workers KV era el problema, retrasando el diagnóstico.

Referencia: Cloudflare Status  
https://www.cloudflarestatus.com/

### 12:00–13:05 — Máximo impacto global
Servicios afectados dentro y fuera de Cloudflare:

- **ChatGPT, X/Twitter, Spotify, Canva, Discord, Shopify, Amazon, Meta, WhatsApp**, etc.
- **Workers KV**, **Turnstile**, **Access**, **Dashboard**, **WARP**.

Referencias:  
TechRadar — https://www.techradar.com/pro/live/a-cloudflare-outage-is-taking-down-parts-of-the-internet  
The Guardian — https://www.theguardian.com/technology/2025/nov/18/cloudflare-outage-causes-error-messages-across-the-internet  

### 13:05–13:37 — Primeras mitigaciones
Se aplican bypasses internos para Workers KV y Access. El impacto disminuye, pero el proxy sigue afectado.

### 14:24–14:42 — Identificación de la causa y despliegue del fix
Se confirma que el archivo de características es el origen del problema. Cloudflare despliega una versión buena del archivo en toda la red. El tráfico vuelve a la normalidad.

### 15:30–17:06 — Recuperación total
Servicios internos como Dashboard y soporte siguen inestables por backlog.  
A las **17:06** se confirma estabilidad general.  
A las **19:28 UTC**, el incidente se marca oficialmente como **Resuelto**.

---

## 3. Causa técnica explicada

1. Cambio en ClickHouse → consulta genera **más columnas** (duplicación).
2. Archivo de características crece por encima del límite esperado.
3. Módulo de Bot Management carga el archivo → supera el límite de features → **panic en código Rust** del proxy.
4. El proxy es la capa principal del tráfico de Cloudflare → caída global.

Referencias técnicas:  
Blog de Cloudflare (explicación completa):  
https://blog.cloudflare.com/18-november-2025-outage/

---

## 4. Servicios y sectores afectados

### Servicios de Cloudflare:
- CDN y WAF  
- Workers KV  
- Access (Zero Trust)  
- Turnstile  
- Dashboard y login  
- WARP  
- Portal de soporte  

### Plataformas externas afectadas:
- ChatGPT  
- X/Twitter  
- Spotify  
- Canva  
- Discord  
- Shopify (tiendas globales)  
- Amazon  
- Facebook, Instagram, WhatsApp  
- Servicios de streaming y juegos  

Referencias:  
https://www.theguardian.com/  
https://www.techradar.com/  
https://www.cloudflarestatus.com/

---

## 5. Referencias completas

- Blog oficial del incidente de Cloudflare:  
  https://blog.cloudflare.com/18-november-2025-outage/

- Cloudflare Status Page:  
  https://www.cloudflarestatus.com/

- Cobertura de medios:  
  TechRadar — https://www.techradar.com/pro/live/a-cloudflare-outage-is-taking-down-parts-of-the-internet  
  The Guardian — https://www.theguardian.com/technology/2025/nov/18/cloudflare-outage-causes-error-messages-across-the-internet  

- Artículos y reportes adicionales:  
  (Incluyendo referencias provistas en conversación)  
