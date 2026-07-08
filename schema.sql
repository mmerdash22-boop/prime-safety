-- =====================================================================
-- Prime Safety — Supabase schema
-- شغّل الكود ده كامل مرة واحدة من: Supabase Dashboard → SQL Editor → New query
-- =====================================================================

-- 1) جدول الملفات الشخصية (يتربط تلقائيًا بكل حساب دخول)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'student', -- 'student' أو 'admin'
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (
    auth.uid() = id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- عند تسجيل حساب جديد، اتنشئله أوتوماتيك صف في profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2) جدول الكورسات / الشهادات المتاحة
create table if not exists public.courses (
  id text primary key,
  title text not null,
  subtitle text,
  description text,
  sort_order int not null default 0
);

alter table public.courses enable row level security;

create policy "courses_select_all"
  on public.courses for select
  using (true);

insert into public.courses (id, title, subtitle, description, sort_order) values
  ('NEBOSH', 'NEBOSH', 'National Examination Board in Occupational Safety and Health', 'شهادة عالمية معتمدة في السلامة والصحة المهنية، مناسبة لمهندسي ومسؤولي السيفتي في كل الصناعات.', 1),
  ('IOSH', 'IOSH', 'Institution of Occupational Safety and Health', 'كورس متخصص في إدارة السلامة المهنية للمشرفين والإداريين، ومعترف بيه عالميًا.', 2),
  ('OSHA', 'OSHA', 'Occupational Safety and Health Administration', 'شهادة أمريكية معتمدة في معايير السلامة المهنية داخل مواقع العمل والمصانع.', 3),
  ('ISO45001', 'ISO 45001', 'Occupational Health & Safety Management', 'نظام إدارة السلامة والصحة المهنية طبقًا للمواصفة الدولية ISO 45001.', 4)
on conflict (id) do nothing;

-- 3) جدول التسجيلات (كل تسجيلات الطلبة، مجمّعة في مكان واحد)
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name_ar text not null,
  name_en text,
  national_id text not null,
  age int,
  whatsapp text,
  phone text not null,
  address text,
  reg_date date not null default current_date,
  course_start date,
  course_end date,
  certificate_code text not null,      -- يشير لـ courses.id أو 'OTHER'
  certificate_custom text,             -- اسم الشهادة لو مش في القائمة
  fees numeric not null default 0,
  paid numeric not null default 0,
  payment_method text,
  notes text,
  id_image_path text,
  receipt_image_path text,
  status text not null default 'قيد المراجعة', -- قيد المراجعة / مؤكد / مكتمل
  created_at timestamptz not null default now()
);

alter table public.enrollments enable row level security;

create policy "enrollments_select_own_or_admin"
  on public.enrollments for select
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "enrollments_insert_own"
  on public.enrollments for insert
  with check (auth.uid() = user_id);

create policy "enrollments_update_admin_only"
  on public.enrollments for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "enrollments_delete_admin_only"
  on public.enrollments for delete
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- =====================================================================
-- 4) تخزين الملفات (صور البطاقة والإيصال)
-- روح على Storage من القائمة الجانبية وأنشئ Bucket اسمه بالظبط: attachments
-- خليه Private (يعني مش Public) ثم شغّل الكود ده:
-- =====================================================================

create policy "attachments_insert_own_folder"
  on storage.objects for insert
  with check (
    bucket_id = 'attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "attachments_select_own_or_admin"
  on storage.objects for select
  using (
    bucket_id = 'attachments'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
    )
  );

-- =====================================================================
-- 5) بعد ما تسجل حسابك الأول من صفحة التسجيل في المنصة، رقّي حسابك لـ admin:
-- (استبدل الإيميل بإيميلك اللي سجلت بيه)
-- =====================================================================
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'you@example.com');
