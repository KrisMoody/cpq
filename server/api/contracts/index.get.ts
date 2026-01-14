import type { Prisma } from '../../../app/generated/prisma/client.js'
import { ContractStatus } from '../../../app/generated/prisma/client.js'
import { usePrisma } from '../../utils/prisma'

function isValidContractStatus(value: string): value is ContractStatus {
  return Object.values(ContractStatus).includes(value as ContractStatus)
}

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const query = getQuery(event)
  const status = query.status as string | undefined
  const customerId = query.customerId as string | undefined

  const where: Prisma.ContractWhereInput = {}

  if (status && isValidContractStatus(status)) {
    where.status = status
  }

  if (customerId) {
    where.customerId = customerId
  }

  const contracts = await prisma.contract.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      customer: {
        select: { id: true, name: true, company: true },
      },
      _count: {
        select: { priceEntries: true },
      },
    },
  })

  return contracts.map((contract) => ({
    ...contract,
    priceEntryCount: contract._count.priceEntries,
    _count: undefined,
  }))
})
