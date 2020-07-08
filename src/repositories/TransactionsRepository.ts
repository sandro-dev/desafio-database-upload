import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);

    const incomeTransactions = await transactionsRepository.find({
      where: { type: 'income' },
    });

    const income = incomeTransactions.reduce(
      (total, current) => total + current.value,
      0,
    );

    const outcomeTransactions = await transactionsRepository.find({
      where: { type: 'outcome' },
    });

    const outcome = outcomeTransactions.reduce(
      (total, current) => total + current.value,
      0,
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
