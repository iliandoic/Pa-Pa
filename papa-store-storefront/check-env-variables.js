const c = require("ansi-colors")

const requiredEnvs = [
  {
    key: "NEXT_PUBLIC_API_URL",
    description: "The URL of the Papa API backend (e.g., https://pa-pa-production-b9fa.up.railway.app)",
  },
]

function checkEnvVariables() {
  const missingEnvs = requiredEnvs.filter(function (env) {
    return !process.env[env.key]
  })

  if (missingEnvs.length > 0) {
    console.warn(
      c.yellow.bold("\n⚠️  Warning: Missing environment variables (using defaults)\n")
    )

    missingEnvs.forEach(function (env) {
      console.warn(c.yellow(`  ${c.bold(env.key)}`))
      if (env.description) {
        console.warn(c.dim(`    ${env.description}\n`))
      }
    })

    // Don't exit - allow build with defaults
  }
}

module.exports = checkEnvVariables
