# Prime Safety — منصة التدريب والشهادات المهنية

منصة كاملة باسم **Prime Safety** لتسجيل المتدربين والحصول على شهادات السلامة المهنية (NEBOSH, IOSH, OSHA, ISO 45001) أو أي شهادة تانية يطلبها المتدرب بنفسه.

## أهم حاجة لازم تفهمها

عشان تسجيلات كل الطلبة تتجمع في **مكان واحد تقدر تشوفه انت كإدارة**، ويكون لكل طالب حساب دخول (يوزر نيم + باسورد) — المنصة دلوقتي مبنية على قاعدة بيانات حقيقية مجانية اسمها **Supabase**، مش مجرد حفظ في المتصفح زي النسخة اللي قبل كده.

يعني في خطوة إضافية واحدة قبل ما ترفع المنصة: تعمل حساب Supabase مجاني (5 دقايق) وتشغّل كود جاهز أنا كتبتهولك. بعدها المنصة تشتغل عادي على Netlify.

---

## 1) إنشاء قاعدة البيانات (Supabase) — مرة واحدة بس

1. روح [supabase.com](https://supabase.com) واعمل حساب مجاني (تقدر تسجل بحساب GitHub مباشرة).
2. اضغط **"New project"**: اختار اسم المشروع (مثلاً `prime-safety`)، وحط كلمة مرور لقاعدة البيانات (احفظها كويس)، واختر أقرب Region (Frankfurt أو أي حاجة قريبة من مصر).
3. استنى دقيقة لحد ما المشروع يتجهز.
4. من القائمة الجانبية، افتح **SQL Editor** → **New query**.
5. افتح ملف `sql/schema.sql` الموجود في المشروع، انسخ **كل محتواه**، والصقه في الـ SQL Editor، واضغط **Run**.
   - ده هيعمل: جدول الحسابات، جدول الكورسات (وهيحطلك الأربع شهادات جاهزة)، جدول التسجيلات، وكل قواعد الحماية (RLS) اللي تخلي كل طالب يشوف بياناته بس، وانت (الأدمن) تشوف الكل.
6. من القائمة الجانبية اضغط **Storage** → **"New bucket"** → سمّيه بالظبط: `attachments` → خليه **Private** (مش Public) → Create.
   - بعد إنشاء الـ bucket، ارجع لـ SQL Editor وشغّل الجزء الخاص بـ Storage الموجود في نفس ملف `schema.sql` (تحت عنوان "تخزين الملفات") لو لسه ما اتنفذش.
7. من **Project Settings → API**، هتلاقي:
   - `Project URL`
   - `anon public key`
   
   انسخهم، هتحتاجهم في الخطوة الجاية.

## 2) ربط المشروع بالبيانات دي

1. في مجلد المشروع، هتلاقي ملف اسمه `.env.example` — اعمل نسخة منه وسمّيها `.env` (بدون `.example`).
2. حط جوّاه القيم اللي نسخيتها:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi........
   ```

## 3) الرفع على GitHub

```bash
git init
git add .
git commit -m "Prime Safety platform"
git branch -M main
git remote add origin https://github.com/USERNAME/prime-safety.git
git push -u origin main
```
> ملف `.env` متضاف في `.gitignore` أصلاً، يعني مفاتيحك السرية مش هتترفع مع الكود (وده مهم للأمان). هتحطها يدويًا في Netlify زي ما هنشرح تحت.

## 4) النشر على Netlify

1. روح [netlify.com](https://netlify.com) → **"Add new site" → "Import an existing project"** → اختر GitHub → اختر الـ repo.
2. Netlify هيكتشف `npm run build` و `dist` تلقائيًا من ملف `netlify.toml`.
3. **قبل ما تعمل Deploy**: افتح **"Add environment variables"** وضيف نفس المتغيرين:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. اضغط **Deploy site**. بعد ما يخلص هيديك رابط زي:
   `https://prime-safety-123abc.netlify.app`

## 5) تسجيل حسابك كأدمن (مسؤول المنصة)

1. افتح رابط الموقع بتاعك واعمل **"إنشاء حساب"** بإيميلك.
2. ارجع لـ Supabase → **SQL Editor** وشغّل الأمر ده (استبدل الإيميل بإيميلك):
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'you@example.com');
   ```
3. سجّل خروج ودخول تاني من المنصة — هتلاقي رابط **"لوحة الإدارة"** ظاهر وهتشوف كل تسجيلات الطلبة.

## 6) تفعيل تسجيل الدخول بفيسبوك (اختياري)

الزرار موجود في المنصة جاهز، لكن محتاج منك خطوتين في Facebook و Supabase (مرة واحدة):

1. روح [developers.facebook.com](https://developers.facebook.com) واعمل تطبيق (App) جديد نوعه "Consumer".
2. من إعدادات التطبيق، ضيف منتج **Facebook Login**، وحط الـ Redirect URI اللي هيديهولك Supabase (تلاقيه في Supabase → Authentication → Providers → Facebook).
3. انسخ الـ App ID و App Secret من فيسبوك، والصقهم في Supabase → Authentication → Providers → Facebook → فعّل الـ Provider واحفظ.

لو مش عايز تتعامل مع فيسبوك دلوقتي، عادي خالص — التسجيل بالإيميل وكلمة المرور شغال بالكامل من غيره.

## 7) عن صور الكورسات

بدل ما أستخدم صور جاهزة من الإنترنت (بتكون فيها مشاكل حقوق ملكية ومش دايمًا مطابقة لهوية المنصة)، صممتلك لكل شهادة **رسمة مميزة بألوان برايم سيفتي (دهبي وأسود)** بدل الصور الفوتوغرافية. لو عندك صور حقيقية لمهندسين أو مواقع تدريب فعلية عندكم وعايز تستبدلها:

1. حط الصورة في `src/assets/` (مثلاً `nebosh-course.jpg`).
2. في ملف `src/components/CourseCard.jsx`، استبدل `<CourseArt code={course.id} .../>` بـ `<img src={yourImage} className="h-full w-full object-cover" />`.

## التشغيل محليًا (للمطورين)

```bash
npm install
npm run dev
```

## طرق الدفع المتاحة
- نقدًا
- تحويل بنكي
- إنستاباي — 01228614557
- فودافون كاش — 01030486577
- شيك
