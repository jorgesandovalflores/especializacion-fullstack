resource "kubernetes_deployment" "nodejs_app" {
    metadata {
        name = "nodejs-app"
    }

    spec {
        replicas = 2

        selector {
            match_labels = {
                app = "nodejs-app"
            }
        }

        template {
            metadata {
                labels = {
                    app = "nodejs-app"
                }
            }

            spec {
                container {
                    name  = "nodejs-app"
                    image = var.nodejs_image

                    port {
                        container_port = 3000
                    }
                }
            }
        }
    }
}

resource "kubernetes_service" "nodejs_service" {
    metadata {
        name = "nodejs-service"
    }

    spec {
        selector = {
            app = kubernetes_deployment.nodejs_app.spec.0.template.0.metadata.0.labels.app
        }

        port {
            port        = 80
            target_port = 3000
        }

        type = "LoadBalancer"
    }
}