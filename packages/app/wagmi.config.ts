import { defineConfig } from '@wagmi/cli'
import { hardhat, react } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'app/abi/generated.ts',
  plugins: [
    hardhat({
      project: '../contracts',
    }),
    react()
  ],
})
