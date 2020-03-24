# vim: set ft=hcl:
cat << EOF
job "lmap" {
  datacenters = ["dc1"]

  group "lmap" {
    count = 1

    task "lmap" {
      driver = "docker"

      config {
        image = "allgreed/lmap:$VERSION"
        port_map = {
            http = 80
        }
      }

      resources {
        cpu    = 100
        memory = 50

        network {
            port "http" {
                static = "6789"
            }
        }
      }
    }
  }
}
EOF
