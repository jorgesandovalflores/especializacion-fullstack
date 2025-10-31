# Incidente Microsoft Azure — 29 de octubre de 2025

## 1) Línea de tiempo  

### 🕒 ~15:45 UTC (≈ 11:45 a.m. ET)  
- Las primeras alertas visibles: monitorización de terceros (por ejemplo Cisco ThousandEyes) detecta anomalías en Azure Front Door (AFD)‑red global/ingreso de tráfico.  
- Usuarios comienzan a reportar fallos de acceso a servicios de Microsoft (por ejemplo Microsoft 365, Xbox Live) y otros sitios web dependientes.  

### ~16:00 UTC (≈ 12:00 p.m. ET)  
- Microsoft confirma que “starting at approximately 16:00 UTC … customers and Microsoft services leveraging Azure Front Door (AFD) may have experienced latencies, timeouts, and errors.”  
- En su portal de estado, Microsoft publica que la causa es una “configuration change” involuntaria que impactó AFD.  

### ~17:26 UTC  
- Microsoft registra que el portal de Azure “fell away from Azure Front Door” (es decir, el portal interno se desligó de AFD como medida de contención).  

### ~17:30 UTC  
- Microsoft bloquea **todos los nuevos cambios de configuración** en AFD para evitar propagación del estado erróneo.  

### ~18:30‑18:45 UTC  
- Comienza el despliegue de la “last known good configuration” (última configuración conocida buena) a nivel global en AFD.  
- Se inicia recuperación manual de nodos de borde (edge nodes) y re‑equilibrio del tráfico hacia nodos sanos.  

### ~00:05 UTC (30 oct)  
- Microsoft confirma que el impacto de AFD está mitigado (“AFD impact confirmed mitigated for customers”).  

### Periodo de impacto total  
- El evento duró **más de 8 horas**, desde aproximadamente 12 p.m. ET (16:00 UTC) hasta ~00:05 UTC del día siguiente para mitigación completa.  

---

## 2) Versión oficial de Microsoft  
- Microsoft indica que el problema fue causado por un cambio de configuración inadvertido en AFD y que la infraestructura de AFD (nodos globales) perdió salud y no pudo enrutar correctamente el tráfico.  
- “While error rates and latency are back to pre‑incident levels, a small number of customers may still be seeing issues…” — Microsoft declara que está en proceso de mitigación de “cola larga”.  
- Microsoft recomienda que los clientes implementen estrategias de fail‑over, por ejemplo usar Azure Traffic Manager para redirigir tráfico mientras AFD se estabiliza.  

---

## 3) Versión no oficial / prensa / analistas  
- Varios medios indican que la caída afectó no solo los servicios de Microsoft, sino también organizaciones que dependen de Azure (por ejemplo Alaska Airlines, Starbucks Corporation, Costco Wholesale Corporation) que vieron caídas en sus webs/apps.  
- Analistas señalan que otro factor crítico fue la dependencia de un solo tejido global de borde (AFD) para distribución de contenido y routing de apps globales; cuando falla ese tejido, el “blast radius” es amplio.  
- En foros técnicos usuarios comentan que el estallido fue visible incluso para recursos que no estaban directamente en Azure Front‑Door pero dependían de él para servicios frontend, DNS, autenticación.  

---

## 4) Impacto en el ecosistema  
- Servicios afectados: Microsoft 365 (incluyendo Outlook, Teams), Xbox, Minecraft, Azure Portal, otros servicios de Azure (App Service, SQL DB, Virtual Desktop, etc.).  
- Empresas externas afectadas: Alaska Airlines, Starbucks, Costco.  
- La caída refuerza la llamada atención sobre riesgos de centralización de infraestructura cloud y la importancia de resiliencia en la capa de distribución global.  

---

## 5) Lecciones técnicas para arquitecturas cloud  
1. Un cambio de configuración **global** en un servicio de borde/routing (como AFD) puede provocar más impacto que fallas en instancias individuales.  
2. La capa de “ingreso global / distribución de contenidos / roteo” es crítica.  
3. Implementar rollback automático y validación canary para cambios globales.  
4. Diseñar fallback activo para servicios de distribución global.  
5. Considerar escenarios de fallo global del proveedor.  

---

## 6) Checklist de resiliencia para cargas en Azure  
- Verificar **dependencias de Azure Front Door (AFD)**.  
- Tener **failover de tráfico** con Azure Traffic Manager o CDN alterna.  
- Bloqueo de cambios globales sin validación previa.  
- TTL de DNS razonables y fallback.  
- Pruebas de degradación simulando pérdida del borde.  
- Monitorear la capa de borde y tráfico HTTP 502/504.  
- Acceso alternativo vía CLI/PowerShell si el portal cae.  

---

## 7) Preguntas para discusión en clase  
1. ¿Qué diferencias hay entre un fallo regional y uno global de borde?  
2. ¿Cómo diseñarías un fallback para Azure Front Door?  
3. ¿Qué impacto tiene esto en los SLAs internos de negocio?  
4. ¿Qué señales de monitoreo detectarían fallas en la capa de borde?  
5. ¿Multi‑nube es suficiente o hace falta algo más?  

---

> **Fuentes clave:**  
> - Reuters: Microsoft Azure’s services restored after global outage.  
> - Tom’s Guide: Microsoft was down — live updates on outage.  
> - Data Center Knowledge: Microsoft Azure Outage: Web Services Down.  
> - Microsoft Azure Status History: Azure Front Door incident details.  
