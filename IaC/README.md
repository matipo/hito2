# Proyecto IaC — Infraestructura como Código con Terraform

## ¿Qué es esto y para qué sirve?

Este proyecto define **toda la infraestructura de AWS** necesaria para ejecutar una
aplicación web contenedorizada usando **Terraform** (Infraestructura como Código).

El objetivo es que la infraestructura sea:
- **Reproducible**: ejecutando `terraform apply` se crea exactamente el mismo entorno
  las veces que sea necesario.
- **Versionada**: todo está en Git, se puede revisar el historial de cambios.
- **Automatizable**: no requiere clics en la consola de AWS.
- **Destruible**: con `terraform destroy` se eliminan todos los recursos sin dejar
  residuos.

---

## Arquitectura del proyecto

```
                          ┌──────────────────────────────────────┐
                          │              Internet                 │
                          └──────────────┬───────────────────────┘
                                         │
                          ┌──────────────▼───────────────────────┐
                          │  CloudFront (CDN, HTTPS)              │
                          │  → Redirige HTTP a HTTPS              │
                          └──────────────┬───────────────────────┘
                                         │
                          ┌──────────────▼───────────────────────┐
                          │  Application Load Balancer (ALB)      │
                          │  → Puerto 80 (solo accesible          │
                          │    desde CloudFront vía prefix list)  │
                          └──────────────┬───────────────────────┘
                                         │
                          ┌──────────────▼───────────────────────┐
                          │  ECS Fargate                          │
                          │  (2 tareas contenedorizadas,          │
                          │   auto-scaling al 60% CPU)            │
                          └──┬─────────────────────────────┬─────┘
                             │                             │
               ┌─────────────▼──┐             ┌───────────▼──────────┐
               │  ECR            │             │  DynamoDB             │
               │  (imagen Docker)│             │  (datos de la app)   │
               └────────────────┘             └──────────────────────┘
                             │
               ┌─────────────▼──────────────────────────────────┐
               │  API Gateway HTTP API                           │
               │  → POST /checkout                               │
               └─────────────┬──────────────────────────────────┘
                             │
               ┌─────────────▼──────────────────────────────────┐
               │  Lambda (Python 3.12)                           │
               │  → Procesa checkout, escribe en DynamoDB        │
               └─────────────────────────────────────────────────┘

               ┌─────────────────────────────────────────────────┐
               │  VPC (10.0.0.0/16)                              │
               │  ┌───────────────────────────────────────────┐  │
               │  │ Subnet 1 (10.0.1.0/24) — us-east-1a       │  │
               │  │ Subnet 2 (10.0.2.0/24) — us-east-1b       │  │
               │  │ Internet Gateway + Route Table             │  │
               │  │                                           │  │
               │  │ VPC Endpoints:                             │  │
               │  │  ├─ DynamoDB (Gateway, gratis)             │  │
               │  │  ├─ S3 (Gateway, gratis)                   │  │
               │  │  ├─ ECR Docker (Interface)                 │  │
               │  │  └─ ECR API (Interface)                    │  │
               │  └───────────────────────────────────────────┘  │
               └─────────────────────────────────────────────────┘
```

### ¿Por qué estos componentes y no otros?

| Componente              | ¿Qué hace?                                          | ¿Por qué lo necesitamos?                                          |
|-------------------------|-----------------------------------------------------|-------------------------------------------------------------------|
| **VPC + Subnets**       | Red virtual aislada dentro de AWS                   | Aísla nuestra infraestructura; define rangos de IP y disponibilidad|
| **Internet Gateway**    | Puerta de enlace hacia internet                     | Sin esto, los recursos dentro de la VPC no pueden salir a internet |
| **Security Groups**     | Firewolls virtuales que controlan tráfico           | ALB: solo permite HTTP desde CloudFront. ECS: solo permite HTTP desde ALB. VPCE: solo HTTPS desde ECS |
| **CloudFront**          | CDN que entrega contenido con HTTPS                 | Provee HTTPS gratuito con certificado wildcard; cachea assets estáticos |
| **VPC Endpoints**       | Acceso a servicios AWS sin traversar internet       | DynamoDB y S3 (Gateway, gratis), ECR (Interface). Reduce superficie de exposición |
| **ALB**                 | Balanceador de carga que distribuye tráfico HTTP    | Reparte las peticiones entre las 2 tareas ECS; si una falla, la otra sigue |
| **ECS Fargate**         | Servicio gestionado de contenedores (serverless)    | Ejecuta la aplicación sin tener que administrar servidores         |
| **Auto Scaling**        | Escala tareas entre 2 y 4 según CPU                 | Mantiene la disponibilidad ante picos de tráfico (target al 60% CPU) |
| **ECR**                 | Repositorio privado de imágenes Docker              | Almacena la imagen del contenedor que ECS va a ejecutar           |
| **DynamoDB**            | Base de datos NoSQL serverless                      | Almacena los datos de la aplicación; pago por uso                 |
| **API Gateway HTTP API**| API REST managed para el checkout                   | Expone el endpoint POST /checkout de forma serverless y escalable |
| **Lambda**              | Función serverless (Python 3.12)                    | Procesa el checkout: valida, genera orden y escribe en DynamoDB   |
| **CloudWatch**          | Servicio de logs y monitoreo                        | Guarda los logs que genera el contenedor para depuración          |
| **Budget**              | Alerta de costos mensuales                          | Notifica al 80% de USD $20/mes para evitar sorpresas de facturación |

---

## Estructura del proyecto (¿por qué está organizado así?)

```
IaC/
├── main.tf                 # Punto de entrada: invoca los 6 módulos + budget
├── variables.tf            # Variables de entrada
├── outputs.tf              # Valores de salida
├── providers.tf            # Configuración del proveedor AWS
├── version.tf              # Versiones de Terraform y provider
├── backend.tf              # Backend remoto S3 + DynamoDB
├── terraform.tfvars.example# Ejemplo de valores para las variables (copiar a terraform.tfvars)
├── bootstrap.ps1           # Script para crear backend (Windows)
├── bootstrap.sh            # Script para crear backend (Linux/Mac)
├── Dockerfile              # Construye la imagen nginx con la app
├── nginx.conf              # Configuración del servidor nginx
├── docker-entrypoint.sh    # Script de entrada del contenedor
├── .dockerignore           # Archivos ignorados al construir la imagen
├── lambda/
│   ├── checkout.py         # Código de la Lambda (Python 3.12)
│   └── checkout.zip        # Empaquetado de la Lambda
├── null-trade/             # Código fuente de la aplicación web (Preact + Vite)
│   ├── src/                # Código fuente
│   ├── dist/               # Archivos compilados listos para producción
│   ├── package.json        # Dependencias y scripts
│   └── vite.config.ts      # Configuración de Vite
└── modules/
    ├── network/            # VPC, subnets, Internet Gateway, Security Groups
    ├── alb/                # Application Load Balancer, Target Group, Listener, CloudFront
    ├── ecs/                # Cluster ECS, Task Definition, Service, IAM, logs, Auto Scaling
    ├── ecr/                # Repositorio de imágenes Docker
    ├── database/           # Tabla DynamoDB para la aplicación
    └── api/                # API Gateway HTTP API + Lambda checkout
```

### ¿Por qué separar en módulos?

Cada módulo encapsula un componente de la infraestructura con su propia lógica,
variables y salidas. Esto permite:
1. **Reutilizar**: si otro proyecto necesita una VPC, podemos usar el módulo network
2. **Mantener**: los cambios en un componente no afectan a otros
3. **Entender**: cada módulo tiene una responsabilidad única y clara

### ¿Por qué separar variables, outputs y providers?

- **variables.tf**: define qué parámetros puede cambiar quien ejecute el proyecto
  (región, nombres, CIDRs). Así nadie necesita editar el código directamente.
- **outputs.tf**: muestra información útil después del `apply` (DNS del ALB, URL de
  CloudFront, endpoint de la API). Es la "cara visible" de la infraestructura.
- **providers.tf**: configura cómo conectarse a AWS y añade tags automáticos a
  todos los recursos para identificarlos.
- **version.tf**: fija las versiones para evitar sorpresas por cambios en Terraform
  o en el provider de AWS.

---

## ¿Qué hace cada módulo en detalle?

### Módulo `network`

Crea la red virtual donde vivirá todo:
- **VPC** con rango `10.0.0.0/16` (65.536 direcciones IP posibles)
- **2 subnets públicas** en zonas de disponibilidad distintas (`us-east-1a` y `us-east-1b`)
  para alta disponibilidad
- **Internet Gateway** para que los recursos tengan salida a internet
- **Route table** que dirige el tráfico `0.0.0.0/0` al Internet Gateway
- **Security Group del ALB**: solo permite tráfico HTTP (puerto 80) desde los rangos
  de IP de CloudFront (usando managed prefix list), y todo el tráfico saliente
- **Security Group de ECS**: permite tráfico HTTP (puerto 80) desde el ALB, HTTPS (443)
  hacia los VPC Endpoints dentro de la VPC, y HTTPS hacia API Gateway (internet)
- **VPC Endpoints** para que el tráfico AWS no salga por internet público:
  - **DynamoDB** (Gateway, gratis): tráfico de datos se mantiene dentro de la red AWS
  - **S3** (Gateway, gratis): necesario para que ECR acceda a las capas de imágenes
  - **ECR Docker** (Interface): pull de imágenes del contenedor sin traversar internet
  - **ECR API** (Interface): metadatos del repositorio sin traversar internet
  - **Security Group de VPC Endpoints**: solo permite tráfico HTTPS (443) desde las tasks ECS

### Módulo `alb`

Crea el balanceador de carga y el CDN frente a la aplicación:
- **ALB** público (accesible solo desde CloudFront) de tipo application
- **Target Group** que monitorea la salud de las tareas ECS cada 30 segundos
- **Listener** en puerto 80 que reenvía el tráfico al Target Group
- **CloudFront Distribution**: CDN que termina HTTPS, redirige HTTP → HTTPS, y
  entrega la aplicación con un certificado wildcard de AWS. Configurado con
  `Managed-CachingDisabled` (caching deshabilitado para contenido dinámico)
  y compresión habilitada. `PriceClass_100` (solo Norteamérica)

### Módulo `ecr`

Crea el repositorio donde se almacena la imagen Docker:
- Repositorio privado con el nombre del proyecto
- **Escaneo de imágenes** automático al subir (seguridad)

### Módulo `ecs`

Crea todo lo necesario para ejecutar contenedores:
- **Rol IAM de ejecución** con dos custom policies acotadas:
  - `ecr_pull`: solo `GetAuthorizationToken`, `BatchCheckLayerAvailability`,
    `GetDownloadUrlForLayer`, `BatchGetImage` sobre el ARN del repo ECR
  - `ecs_logs`: solo `CreateLogStream` + `PutLogEvents` sobre el log group del proyecto
- **Rol IAM de tarea** (permisos para que la aplicación lea/escriba en DynamoDB)
- **CloudWatch Log Group** donde se guardan los logs del contenedor (30 días de retención)
- **Cluster ECS** (agrupación lógica de servicios)
- **Task Definition** que define cómo ejecutar el contenedor (256 CPU, 512 MB RAM,
  variable de entorno `API_URL` con el endpoint de la API Gateway)
- **Service** que mantiene 2 tareas corriendo siempre, conectado al ALB
- **Auto Scaling**: target tracking al 60% de utilización de CPU, con un mínimo
  de 2 tareas y máximo de 4 tareas

### Módulo `database`

Crea la base de datos NoSQL:
- **Tabla DynamoDB** con facturación bajo demanda (pago por uso, sin aprovisionar)
- Clave primaria: `id` (String)
- Ideal para aplicaciones que necesitan una base de datos simple y escalable

### Módulo `api`

Crea la API serverless para el proceso de checkout:
- **Lambda function** (Python 3.12): recibe el carrito de compras, genera una orden
  con `id` único, estado `PAGADO` y timestamp, y la guarda en DynamoDB
- **API Gateway HTTP API**: expone `POST /checkout` con CORS habilitado para `*`
- **Roles IAM**: la Lambda asume un rol con permisos acotados sobre la tabla DynamoDB
  y logs en CloudWatch

### Budget (en `main.tf`)

- Alerta mensual de costos: notifica por email (`taller-icinf@ulagos.cl`) cuando
  los costos superan el 80% de USD $20/mes

---

## ¿Por qué un backend remoto S3 + DynamoDB?

Terraform guarda el "estado" de la infraestructura en un archivo (`terraform.tfstate`).
Este archivo es crítico porque:
- Mapea los recursos declarados contra los recursos reales en AWS
- Si se pierde, Terraform no sabe qué recursos gestionar

### Backend remoto S3 + DynamoDB (implementado)
- **S3**: almacena el archivo de estado de forma segura y con versionado
- **DynamoDB**: evita que dos personas ejecuten `apply` al mismo tiempo (bloqueo)
- **Cifrado**: el estado se guarda cifrado en reposo

---

## Instrucciones paso a paso

### Prerrequisitos

1. **Terraform** >= 1.8 instalado ([descargar](https://developer.hashicorp.com/terraform/downloads))
2. **AWS CLI** instalado y configurado con tus credenciales:
   ```bash
   aws configure
   ```
3. Una **cuenta AWS** con permisos para crear los recursos del proyecto
4. **Docker** instalado para construir y subir la imagen
5. **Node.js** >= 18 (solo si necesitas modificar y recompilar la aplicación)

### Paso 1: Elegir un nombre único para el bucket S3

Este nombre identificará tu bucket de estado. Debe ser único en todo AWS.
Recomendación: `taller-icinf-{año}-{tus-iniciales}`

Ejemplo: `taller-icinf-2026-jperez`

### Paso 2: Crear el bucket S3 y la tabla DynamoDB

**Opción A — Con AWS CLI (recomendado):**

```powershell
# Windows PowerShell
.\bootstrap.ps1 taller-icinf-2026-jperez
```

```bash
# Linux / Mac / Git Bash
chmod +x bootstrap.sh
./bootstrap.sh taller-icinf-2026-jperez
```

### Paso 3: Inicializar Terraform

El bloque `backend` de Terraform **no acepta variables** (es una limitación del
lenguaje). Por eso usamos **configuración parcial**: el nombre del bucket se pasa
por línea de comandos en lugar de escribirlo en el archivo:

```bash
terraform init -backend-config="bucket=taller-icinf-2026-jperez"
```

Si todo sale bien, verás:
```
Successfully configured the backend "s3"!
```

> Si usaste el script `bootstrap.ps1` o `bootstrap.sh`, ya te mostró el comando
> exacto al final de su ejecución. Solo cópialo y pégalo.

### Paso 4: Revisar el plan

```bash
terraform plan
```

Terraform te mostrará todos los recursos que va a crear.

### Paso 5: Crear la infraestructura

```bash
terraform apply
```

Escribe `yes` cuando te pida confirmación. La creación toma aproximadamente 3-5 minutos.
Al final, verás las salidas con la URL de CloudFront, el DNS del ALB, el endpoint
de la API, el nombre del cluster, etc.

### Paso 6: Subir la imagen Docker a ECR

La infraestructura está creada, pero ECR está vacío. ECS no tiene imagen que ejecutar.
Necesitas construir y subir la imagen Docker de la aplicación al repositorio.

> La aplicación `null-trade` (Preact + Vite + Tailwind) ya está incluida en este
> repositorio, dentro de la carpeta `null-trade/`. El `Dockerfile` y `nginx.conf`
> están en la raíz del proyecto IaC.

1. Autenticar Docker con ECR:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $(terraform output -raw repository_url)
   ```

2. Construir la imagen:
   ```bash
   docker build -t null-trade .
   ```

3. Tagear y subir:
   ```bash
   docker tag null-trade:latest $(terraform output -raw repository_url):latest
   docker push $(terraform output -raw repository_url):latest
   ```

4. Una vez subida, ECS automáticamente tomará la nueva imagen y empezará a
   ejecutar tu aplicación. Puedes verificarlo en la consola de AWS → ECS → cluster.

5. Abrir en el navegador:
   ```bash
   terraform output cloudfront_url
   ```

> **Nota:** Si haces cambios en el código fuente, recuerda reconstruir la aplicación
> primero con `npm run build` (dentro de `null-trade/`) y luego reconstruir la imagen Docker.

### Destruir todo (cuando termines)

```bash
terraform destroy
```

Esto eliminará **todos** los recursos creados. Es importante ejecutarlo al finalizar
para no generar costos innecesarios en AWS.

---

## Consideraciones de seguridad

- **No hay credenciales en el código**: las variables sensibles están marcadas
  con `sensitive = true` y no se muestran en pantalla.
- **Mínimo privilegio**: los roles IAM solo tienen los permisos necesarios.
  El rol de ejecución ECS usa custom policies (ECR pull acotado al repo + CloudWatch
  logs acotado al log group del proyecto) en lugar de la política administrada.
  El rol de tarea ECS y el de la Lambda solo acceden a la tabla DynamoDB específica.
- **Escaneo de imágenes**: ECR escanea automáticamente las imágenes en busca
  de vulnerabilidades.
- **Tags en todos los recursos**: cada recurso tiene tags de identificación
  (Name, Project, Environment, ManagedBy) para facilitar su gestión y
  facturación.
- **Security Groups restringidos**: el ALB solo acepta tráfico desde CloudFront
  (usando managed prefix list), y ECS solo acepta tráfico desde el ALB.
  Los VPC Endpoints solo aceptan tráfico HTTPS desde las tasks ECS.
- **VPC Endpoints**: DynamoDB, S3 y ECR accesibles sin salir por internet
  público, reduciendo la superficie de exposición de los datos.
- **Budget con alerta**: notificación por email al 80% de USD $20/mes.
- **Trade-off documentado**: `assign_public_ip = true` en ECS se mantiene porque
  las tasks necesitan alcanzar API Gateway (servicio público sin VPC endpoint
  económico). Para eliminarlo se requeriría un NAT Gateway (~$32 USD/mes).

---

## Variables de configuración

Edita `terraform.tfvars` para personalizar el despliegue:

| Variable        | ¿Qué controla?                             | Valor ejemplo    |
|-----------------|--------------------------------------------|------------------|
| `aws_region`    | Región de AWS donde se crea todo           | `us-east-1`      |
| `project_name`  | Prefijo con el que se nombran los recursos | `null-trade`     |
| `environment`   | Entorno (dev, staging, prod)               | `dev`            |
| `vpc_cidr`      | Rango de IP de la VPC                      | `10.0.0.0/16`    |
| `subnet1_cidr`  | Rango de IP de la subred 1                 | `10.0.1.0/24`    |
| `subnet2_cidr`  | Rango de IP de la subred 2                 | `10.0.2.0/24`    |
| `desired_count` | Número de tareas ECS en ejecución          | `2`              |

---

## Flujo de trabajo típico

```
1. git clone <este-repo>
2. Elegir nombre bucket único (ej: taller-icinf-2026-jperez)
3. .\bootstrap.ps1 <nombre-bucket>
4. terraform init -backend-config="bucket=<nombre-bucket>"
5. terraform plan
6. terraform apply
7. aws ecr get-login-password | docker login ...  →  Autenticar Docker en ECR
8. docker build -t null-trade .                    →  Construir imagen
9. docker tag + push                               →  Subir imagen a ECR
10. terraform output cloudfront_url                →  Abrir en el navegador
11. terraform destroy                              →  Eliminar todo
```
