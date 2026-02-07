'use server';

import { query } from '@/lib/db';
import { z } from 'zod';

const PaginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
});

const SearchSchema = z.string().optional();

interface BookRow {
    book_id: number;
    title: string;
    author: string;
    total_loans: string;
    rank_most_borrowed: string;
    count?: string;
}

export async function getMostBorrowedBooks(page = 1, searchQuery = '') {
    const limit = 10;
    const offset = (page - 1) * limit;

    const safeSearch = `%${searchQuery.replace(/[%_]/g, '')}%`;

    const sql = `
    SELECT * FROM vw_most_borrowed_books
    WHERE title ILIKE $1 OR author ILIKE $1
    ORDER BY rank_most_borrowed ASC
    LIMIT $2 OFFSET $3
  `;

    const totalSql = `
    SELECT COUNT(*) as count FROM vw_most_borrowed_books
    WHERE title ILIKE $1 OR author ILIKE $1
  `;

    const [data, totalRes] = await Promise.all([
        query(sql, [safeSearch, limit, offset]),
        query(totalSql, [safeSearch])
    ]);

    return {
        data: data.rows as BookRow[],
        totalPages: Math.ceil(Number(totalRes.rows[0].count) / limit),
        page
    };
}

interface LoanRow {
    loan_id: number;
    due_at: string;
    loaned_at: string;
    member_name: string;
    book_title: string;
    days_overdue: number;
    estimated_fine_amount: string;
    urgency_level: string;
}

export async function getOverdueLoans(page = 1, minDays = 0) {
    const limit = 10;
    const offset = (page - 1) * limit;

    const sql = `
    SELECT * FROM vw_overdue_loans
    WHERE days_overdue >= $1
    ORDER BY days_overdue DESC
    LIMIT $2 OFFSET $3
  `;

    const totalSql = `
    SELECT COUNT(*) as count FROM vw_overdue_loans
    WHERE days_overdue >= $1
  `;

    const [data, totalRes] = await Promise.all([
        query(sql, [minDays, limit, offset]),
        query(totalSql, [minDays])
    ]);

    return {
        data: data.rows as LoanRow[],
        totalPages: Math.ceil(Number(totalRes.rows[0].count) / limit),
        page
    };
}

interface FineRow {
    month_str: string;
    total_fines_count: string;
    total_amount_generated: string;
    total_paid: string;
    total_pending: string;
}

export async function getFinesSummary(startDate?: string, endDate?: string) {
    let sql = 'SELECT * FROM vw_fines_summary';
    const params: unknown[] = [];

    if (startDate && endDate) {
        sql += ' WHERE month_str >= $1 AND month_str <= $2';
        params.push(startDate, endDate);
    }

    sql += ' ORDER BY month_str DESC';

    const res = await query(sql, params);
    return res.rows as FineRow[];
}

interface MemberRow {
    member_id: number;
    name: string;
    member_type: string;
    total_loans: string;
    active_overdue_count: string;
    on_time_return_rate: string;
}

export async function getMemberActivity() {
    const sql = 'SELECT * FROM vw_member_activity ORDER BY on_time_return_rate ASC LIMIT 50';
    const res = await query(sql);
    return res.rows as MemberRow[];
}

interface InventoryRow {
    category: string;
    total_copies: string;
    count_available: string;
    count_loaned: string;
    count_lost: string;
    availability_percentage: string;
}

export async function getInventoryHealth() {
    const sql = 'SELECT * FROM vw_inventory_health ORDER BY availability_percentage ASC';
    const res = await query(sql);
    return res.rows as InventoryRow[];
}
