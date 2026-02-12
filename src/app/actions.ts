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
    isbn: string;
    category: string;
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

    const totalRecords = Number(totalRes.rows[0].count);
    const totalPages = Math.ceil(totalRecords / limit);

    return {
        data: data.rows as BookRow[],
        totalPages,
        totalRecords,
        page
    };
}

interface LoanRow {
    loan_id: number;
    loan_date: string;
    return_date: string;
    member_name: string;
    member_email: string;
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

    const totalRecords = Number(totalRes.rows[0].count);
    const totalPages = Math.ceil(totalRecords / limit);

    return {
        data: data.rows as LoanRow[],
        totalPages,
        totalRecords,
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

export async function getFinesSummary(page = 1) {
    const limit = 10;
    const offset = (page - 1) * limit;

    const sql = `
    SELECT * FROM vw_fines_summary
    ORDER BY total_pending DESC
    LIMIT $1 OFFSET $2
  `;

    const totalSql = `
    SELECT COUNT(*) as count FROM vw_fines_summary
  `;

    const [data, totalRes] = await Promise.all([
        query(sql, [limit, offset]),
        query(totalSql)
    ]);

    const totalRecords = Number(totalRes.rows[0].count);
    const totalPages = Math.ceil(totalRecords / limit);

    return {
        data: data.rows as FineRow[],
        totalPages,
        totalRecords,
        page
    };
}

interface MemberRow {
    member_id: number;
    name: string;
    member_type: string;
    total_loans: string;
    active_overdue_count: string;
    on_time_return_rate: string;
}

export async function getMemberActivity(page = 1) {
    const limit = 10;
    const offset = (page - 1) * limit;

    const sql = `
    SELECT * FROM vw_member_activity 
    ORDER BY total_loans DESC 
    LIMIT $1 OFFSET $2
  `;

    const totalSql = `
    SELECT COUNT(*) as count FROM vw_member_activity
  `;

    const [data, totalRes] = await Promise.all([
        query(sql, [limit, offset]),
        query(totalSql)
    ]);

    const totalRecords = Number(totalRes.rows[0].count);
    const totalPages = Math.ceil(totalRecords / limit);

    return {
        data: data.rows as MemberRow[],
        totalPages,
        totalRecords,
        page
    };
}

interface InventoryRow {
    count_loaned(count_loaned: any): unknown;
    category: string;
    total_copies: string;
    count_available: string;
    count_borrowed: string;
    count_lost: string;
    availability_percentage: string;
}

export async function getInventoryHealth() {
    const sql = 'SELECT * FROM vw_inventory_health ORDER BY availability_percentage ASC';
    const res = await query(sql);
    return res.rows as InventoryRow[];
}