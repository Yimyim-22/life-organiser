import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

export default function FinanceTracker() {
    const { finance, setFinance } = useData();
    const [amount, setAmount] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('expense'); // expense, income

    const balance = finance.transactions.reduce((acc, t) => acc + (t.type === 'income' ? parseFloat(t.amount) : -parseFloat(t.amount)), 0);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!amount) return;
        const newTx = { id: Date.now(), amount, description: desc, type, date: new Date().toISOString() };
        setFinance({ ...finance, transactions: [newTx, ...finance.transactions] });
        setAmount('');
        setDesc('');
    };

    return (
        <div className="container">
            <h1 className="text-gradient" style={{ marginBottom: '24px' }}>Finances</h1>

            <div className="card" style={{ marginBottom: '24px', textAlign: 'center', padding: '30px' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '5px' }}>Total Balance</p>
                <h2 style={{ fontSize: '2.5rem', color: balance >= 0 ? 'var(--color-primary)' : '#ef4444' }}>
                    ${balance.toFixed(2)}
                </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '15px' }}>Add Transaction</h3>
                    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="button" onClick={() => setType('expense')} style={{ flex: 1, padding: '8px', border: type === 'expense' ? '2px solid #ef4444' : '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: type === 'expense' ? '#ef4444' : 'inherit' }}>Expense</button>
                            <button type="button" onClick={() => setType('income')} style={{ flex: 1, padding: '8px', border: type === 'income' ? '2px solid #10b981' : '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: type === 'income' ? '#10b981' : 'inherit' }}>Income</button>
                        </div>
                        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={{ padding: '10px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }} required />
                        <input type="text" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} style={{ padding: '10px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }} required />
                        <button type="submit" style={{ padding: '10px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)' }}>Add Transaction</button>
                    </form>
                </div>

                <div className="card" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <h3 style={{ marginBottom: '15px', position: 'sticky', top: 0, background: 'var(--bg-card)' }}>History</h3>
                    {finance.transactions.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No transactions yet.</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {finance.transactions.map(t => (
                                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid var(--border-light)' }}>
                                    <div>
                                        <p style={{ fontWeight: '500' }}>{t.description}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                    <span style={{ color: t.type === 'income' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                                        {t.type === 'income' ? '+' : '-'}${t.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
