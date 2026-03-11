
-- Transactions table for financial dashboard
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'income' CHECK (type IN ('income', 'expense', 'payment', 'refund', 'transfer')),
  category text NOT NULL DEFAULT 'general',
  description text NOT NULL,
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  reference text,
  counterparty text,
  notes text,
  transaction_date timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Only admins can manage transactions
CREATE POLICY "Admins manage transactions" ON public.transactions
  FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Accounts/wallets table
CREATE TABLE public.finance_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'bank' CHECK (type IN ('bank', 'cash', 'mobile_money', 'credit_card', 'investment', 'other')),
  balance numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.finance_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage finance_accounts" ON public.finance_accounts
  FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Payment records table
CREATE TABLE public.payment_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_name text NOT NULL,
  recipient_email text,
  recipient_phone text,
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  method text NOT NULL DEFAULT 'bank_transfer' CHECK (method IN ('bank_transfer', 'mobile_money', 'cash', 'check', 'crypto', 'other')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'processing', 'completed', 'failed', 'cancelled')),
  reference text,
  notes text,
  approved_by uuid,
  approved_at timestamp with time zone,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage payment_records" ON public.payment_records
  FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'::app_role));
