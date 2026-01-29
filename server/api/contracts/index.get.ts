import type { Prisma } from '../../../app/generated/prisma/client'
import { ContractStatus } from '../../../app/generated/prisma/client'
import { usePrisma } from '../../utils/prisma'
import { getPhase, phaseWhere } from '../../utils/phase'

function isValidContractStatus(value: string): value is ContractStatus {
  return Object.values(ContractStatus).includes(value as ContractStatus)
}

export default defineEventHandler(async (event) => {
  const prisma = usePrisma()
  const phase = getPhase(event)
  const query = getQuery(event)
  const status = query.status as string | undefined
  const customerId = query.customerId as string | undefined

  const where: Prisma.ContractWhereInput = {
    ...phaseWhere(phase),
  }

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
