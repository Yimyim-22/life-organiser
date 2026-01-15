import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinanceTracker() {
    const { finance, setFinance } = useData();
    const [amount, setAmount] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('expense'); // expense, income
    const [isAdding, setIsAdding] = useState(false);

    const balance = finance.transactions.reduce((acc, t) => acc + (t.type === 'income' ? parseFloat(t.amount) : -parseFloat(t.amount)), 0);
    const income = finance.transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + parseFloat(t.amount), 0);
    const expenses = finance.transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + parseFloat(t.amount), 0);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!amount) return;
        const newTx = { id: Date.now(), amount, description: desc, type, date: new Date().toISOString() };
        setFinance({ ...finance, transactions: [newTx, ...finance.transactions] });
        setAmount('');
        setDesc('');
        setIsAdding(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                        Finance Tracker
                    </h1>
                    <p className="text-slate-500 mt-1">Keep track of your spending and savings.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:scale-105 transition-all active:scale-95"
                >
                    <Plus size={20} /> Add Transaction
                </button>
            </header>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Balance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-48"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl -ml-6 -mb-6" />

                    <div className="relative z-10 flex justify-between items-start">
                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                            <Wallet size={24} className="text-emerald-400" />
                        </div>
                        <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Total Balance</span>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold tracking-tight">
                            ₦{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Available Funds</p>
                    </div>
                </motion.div>

                {/* Income Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/50 flex flex-col justify-between h-48"
                >
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-emerald-50 rounded-xl">
                            <TrendingUp size={24} className="text-emerald-500" />
                        </div>
                        <span className="text-emerald-500 font-bold text-sm bg-emerald-50 px-2 py-1 rounded-lg">+ Income</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                            ₦{income.toLocaleString()}
                        </h3>
                        <p className="text-slate-400 text-sm">Total Earnings</p>
                    </div>
                </motion.div>

                {/* Expense Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/50 flex flex-col justify-between h-48"
                >
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-rose-50 rounded-xl">
                            <TrendingDown size={24} className="text-rose-500" />
                        </div>
                        <span className="text-rose-500 font-bold text-sm bg-rose-50 px-2 py-1 rounded-lg">- Expenses</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                            ₦{expenses.toLocaleString()}
                        </h3>
                        <p className="text-slate-400 text-sm">Total Spending</p>
                    </div>
                </motion.div>
            </div>

            {/* Add Transaction Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/60 mb-8">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Add Transaction</h3>
                            <form onSubmit={handleAdd} className="space-y-4">
                                <div className="flex p-1 bg-slate-100 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setType('expense')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'expense' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-rose-500'
                                            }`}
                                    >
                                        Expense
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setType('income')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'income' ? 'bg-white text-emerald-500 shadow-sm' : 'text-slate-500 hover:text-emerald-500'
                                            }`}
                                    >
                                        Income
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="number"
                                        placeholder="Amount (₦)"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        className="p-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-lg font-mono placeholder:font-sans"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Description (e.g. Lunch, Salary)"
                                        value={desc}
                                        onChange={e => setDesc(e.target.value)}
                                        className="p-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="px-6 py-3 text-slate-500 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-700 transition-colors"
                                    >
                                        Add {type === 'income' ? 'Income' : 'Expense'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Recent Transactions */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/50 min-h-[300px]">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <CreditCard size={20} className="text-slate-400" />
                    Recent Transactions
                </h3>

                {finance.transactions.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                            <DollarSign size={32} />
                        </div>
                        <p className="text-slate-400">No transactions recorded yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {finance.transactions.map(t => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={t.id}
                                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${t.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                                        }`}>
                                        {t.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-700">{t.description}</p>
                                        <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`font-bold font-mono text-lg ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'
                                    }`}>
                                    {t.type === 'income' ? '+' : '-'}₦{parseFloat(t.amount).toLocaleString()}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
