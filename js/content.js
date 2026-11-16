// Досье. Переводимые поля: { ru, en }. Пустая строка: слой не показывается.
// curious: живой короткий рассказ о проекте, от первого лица, без отчётного тона.
// hr: связный мини-кейс: задача, что сделано, итог. Без анкетных плашек.
// tech: стек и зачем. Без url нет кнопки "посмотреть".

export const UI = {
  ru: {
    title: "Илья Гончаров",
    lead: "наведите курсор на куб, чтобы открыть карточку",
    look: "посмотреть",
    soundOn: "звук вкл",
    soundOff: "звук выкл",
    rhythms: { pulse: "удар", torn: "рваный", drops: "ноты" },
    kinds: {
      dev: "разработка",
      art: "арт",
      pm: "продукт",
      study: "учёба",
      note: "заметки",
      link: "ссылки",
    },
  },
  en: {
    title: "Ilia Goncharov",
    lead: "hover a cube to open its card",
    look: "view",
    soundOn: "sound on",
    soundOff: "sound off",
    rhythms: { pulse: "pulse", torn: "torn", drops: "notes" },
    kinds: {
      dev: "dev",
      art: "art",
      pm: "product",
      study: "study",
      note: "notes",
      link: "links",
    },
  },
};

export const items = [
  {
    kind: "dev",
    title: { ru: "Brownfox", en: "Brownfox" },
    role: {
      ru: "продакт + инженер · платежи и чекаут",
      en: "product + engineer · payments and checkout",
    },
    url: "https://brownfox.org/",
    curious: {
      ru: "Магазин шрифтов продаёт по всему миру, а платёжка из России отвечала отказом. Я занимался тем, чтобы у каждого покупателя был свой путь к оплате: один для России, другой для остального мира. Лучший результат здесь тот, которого никто не замечает.",
      en: "A type foundry sells worldwide, but payments from Russia kept failing after sanctions hit. I set up distinct checkout flows for local and international customers so transactions go through seamlessly. The best outcome here is the one nobody notices.",
    },
    hr: {
      ru: "После санкций международные платёжные провайдеры перестали принимать карты из России, а магазин шрифтов продаёт по всему миру. Я выстроил два независимых платёжных контура с автоматическим выбором по региону и языку и запустил их вместе с владельцами: оферта, возвраты, тестовый чек-лист. Закрыто 37 сбоев оплаты, а Sentry показывает ошибки чекаута раньше, чем о них сообщит покупатель.",
      en: "When international gateways stopped accepting Russian cards, this global type foundry faced severe checkout drop-offs. I designed two independent payment pipelines that route buyers automatically by region and language, and coordinated the rollout with the founders: terms of service, refund workflows, and QA checklists. Resolved 37 edge-case failure modes, with Sentry alerting us to checkout bugs before customers notice them.",
    },
    tech: {
      ru: "Next.js 15, React 19, TypeScript. Sanity: владельцы правят тексты и цены сами. Zustand: корзина. Stripe, ЮKassa, FastSpring и Lemon Squeezy за одним интерфейсом. Товары во FastSpring создаются при первой покупке. Sentry: сбои видно сразу. Nginx-прокси с российским IP: Vercel открывался через раз.",
      en: "Next.js 15, React 19, TypeScript. Sanity lets the founders update copy and pricing on their own. Zustand for cart state. Unified abstraction over Stripe, YooKassa, FastSpring, and Lemon Squeezy. FastSpring products are provisioned on demand at first purchase. Sentry telemetry for payment failures. Nginx proxy on a local IP to bypass intermittent Vercel blocking.",
    },
  },
  {
    kind: "dev",
    title: { ru: "Banena", en: "Banena" },
    role: {
      ru: "разработка · клиентский сайт",
      en: "engineering · client site",
    },
    url: "https://banena.ru/",
    curious: {
      ru: "Фотографу было важно, чтобы снимки читались серией, а не набором картинок. Поэтому на сайте два режима, плёнка и сетка, а лайтбокс я написал сам, чтобы интерфейс не спорил с кадрами. Вёл проект от макета до публикации.",
      en: "The photographer needed his work to read as cohesive series rather than a pile of standalone shots. I built filmstrip and gallery modes with a custom lightweight lightbox designed to stay out of the way of the photos. Handled the project from initial layout to launch.",
    },
    hr: {
      ru: "Серию снимков нужно было показать целиком, и сайт должен был одинаково открываться для посетителей, в том числе из России. Я сделал два режима просмотра, собственный просмотрщик со свайпами и подготовку изображений, затем довёл сайт до публикации. Он работает у клиента в эксплуатации.",
      en: "The portfolio had to showcase continuous photo series and load reliably worldwide, including from Russia. I built dual viewing modes, a custom gesture-driven viewer with swipe navigation, and an automated image processing pipeline, then deployed the site to production.",
    },
    tech: {
      ru: "Next.js 14, TypeScript, Tailwind. sharp режет фото до 1920 и в WebP. Свой лайтбокс и свайпы без тяжёлой библиотеки. Скрипты Cloudflare и деплоя: открывается из РФ и выкладывается одной командой.",
      en: "Next.js 14, TypeScript, Tailwind CSS. sharp converts assets to WebP at 1920px. Custom touch/swipe lightbox built from scratch with zero third-party gallery bloat. Cloudflare routing and automated one-command deploys.",
    },
  },
  {
    kind: "dev",
    title: { ru: "Greenwich", en: "Greenwich" },
    role: {
      ru: "продакт + разработка · галерея в Англии",
      en: "product + engineering · UK gallery",
    },
    url: "https://illiagoncharov.github.io/greenwich/",
    curious: {
      ru: "Галерея из Великобритании, и всё общение на английском: от требований до защиты макета. Мне было интересно вести проект на чужом языке и пройти путь от первого брифа до запуска.",
      en: "An independent gallery in the UK. Handled everything end-to-end in English: clarifying requirements, designing the identity and layout, pitching the concept, and taking it across the finish line.",
    },
    hr: {
      ru: "Заказчик из Великобритании пришёл с расплывчатыми требованиями на английском. Я уточнил задачу, сделал макет в Figma, защитил концепцию на английском и организовал разработку и SEO. Проект дошёл до запуска.",
      en: "The client came with an unstructured brief and an open-ended vision. I ran discovery, created the Figma design system, pitched and secured sign-off on the concept, and managed development and technical SEO through to launch.",
    },
    tech: {
      ru: "Next.js 16, React 19, TypeScript, Tailwind 4. Анимации на CSS: без библиотеки ради одного экрана. SVG: не мылится при масштабе.",
      en: "Next.js 16, React 19, TypeScript, Tailwind CSS v4. Native CSS transitions instead of heavy animation runtimes. Vector SVG assets to preserve fidelity across high-DPI displays.",
    },
  },
  {
    kind: "dev",
    title: { ru: "Appyland", en: "Appyland" },
    role: {
      ru: "разработка · командный промо-сайт",
      en: "engineering · team promo site",
    },
    url: "https://appyland.ru/",
    curious: {
      ru: "Промо-сайт с анимацией, который собирает команда. Мой вклад в том, что тяжёлые картинки и сборка под разные площадки делаются скриптами, а не руками. Эту работу не видно на сайте, но команда её чувствует.",
      en: "An animation-heavy promo site built alongside a design team. My role was engineering the delivery pipeline: automating heavy asset conversion and multi-target builds so the team didn't have to fiddle with manual exports. Invisible work that makes the build feel effortless.",
    },
    hr: {
      ru: "Команда делала тяжёлый промо-сайт с анимациями, и подготовка картинок занимала много ручной работы. Я автоматизировал оптимизацию изображений и сборку под разные площадки. Команда освободилась от рутины и занялась самим продуктом.",
      en: "The team was building an asset-intensive marketing site where manual image optimization and multi-environment packaging were eating up engineering time. I automated the media pipeline and deployment targets, letting the team focus entirely on product polish.",
    },
    tech: {
      ru: "Vite 7. sharp: скрипт переводит картинки из Lottie в WebP. Две сборки с разным базовым путём: GitHub Pages и хостинг.",
      en: "Vite 7. sharp script batch-converts raster Lottie assets to WebP. Configured dual build outputs with parameterized base paths for staging and production hosting.",
    },
  },
  {
    kind: "dev",
    title: { ru: "Самокат × Blazar", en: "Samokat × Blazar" },
    role: {
      ru: "продакт + разработка · Музей Москвы",
      en: "product + engineering · Museum of Moscow",
    },
    url: "https://github.com/illiaGoncharov/samokat-art",
    curious: {
      ru: "К выставке в Музее Москвы (Самокат × Blazar) в сжатый срок шли четыре веб-части одной истории. Самый напряжённый кусок — промокоды и API под поток посетителей. Два других контура мы упростили по гайдлайнам Самоката, чтобы успеть четвёртый: веб-VR по QR для работы художницы.",
      en: "For the Blazar art fair at the Museum of Moscow, we had to ship four web deliverables on an aggressive timeline. The critical path was a high-throughput promo code flow and API. We scoped down two secondary surfaces to match Samokat's core brand guidelines, buying us time to pull off the showstopper: an in-browser VR experience for a featured artist accessed via QR.",
    },
    hr: {
      ru: "К выставке в Музее Москвы (Самокат × Blazar) в сжатые сроки нужно было отдать четыре веб-части. Я спроектировал структуру и REST API для сценария с промокодами, который должен стабильно работать при публичной нагрузке, и согласовал материалы с регламентами Самоката. Два промо-контура оптимизировал и привёл к гайдлайнам, чтобы высвободить время на четвёртый: веб-VR-инсталляцию для художницы. Сравнил варианты технологий, собрал VR-сцену на Three.js; посетители заходили в историю по QR. Всё уложилось в срок.",
      en: "Coordinated and engineered four web deliverables for Samokat's pavilion at Blazar under tight deadlines. Architected the data flow and REST API for high-traffic promo code redemption, ensuring strict brand compliance. By streamlining two promotional tracks, we freed bandwidth to prototype and ship an in-browser WebXR/Three.js experience launched instantly via QR codes on-site. Delivered on time with zero downtime during peak fair days.",
    },
    tech: {
      ru: "React на фронте. REST API: промокоды и выдача контента, эндпойнты под пиковую нагрузку в дни выставки. Два промо-контура: оптимизация и соответствие гайдлайнам Самоката. VR: Three.js в браузере, вход по QR.",
      en: "React frontend. Scalable REST API for promo code validation and dynamic content delivery during high-concurrency exhibition spikes. WebGL/Three.js for the QR-triggered interactive art showcase.",
    },
  },
  {
    kind: "dev",
    title: { ru: "sfumato", en: "sfumato" },
    pet: true,
    role: {
      ru: "инженер + продуктовая идея · свой эксперимент",
      en: "engineer + product concept · personal experiment",
    },
    url: "https://illiaGoncharov.github.io/sfumato/",
    curious: {
      ru: "Хотелось выяснить, можно ли собирать слова жестами руки прямо в браузере. Оказалось, можно: камера работает локально, видео никуда не отправляется. Это мой эксперимент от идеи до звука, и позже из него вырос этот сайт.",
      en: "I wanted to see if you could assemble words in real time using hand gestures right in the browser. Turns out you can: camera frames are processed entirely on-device, and no video ever leaves the client. A personal experiment spanning interaction design, WebAssembly, and generative audio — and the technical predecessor to this portfolio.",
    },
    hr: {
      ru: "Хотел проверить гипотезу: можно ли управлять сайтом жестами без установки и без отправки видео. Спроектировал и собрал прототип с локальным распознаванием руки, звуком и собственной цветовой системой. Он работает в браузере, и из него вырос этот сайт.",
      en: "Proved out a product hypothesis: browser-based spatial interaction with zero installation footprint and strict user privacy. Designed and shipped a prototype featuring on-device computer vision, Web Audio synthesis, and an OKLCH-based color engine.",
    },
    tech: {
      ru: "Vanilla JS и Canvas 2D. MediaPipe Hands через WebAssembly, локально. Tone.js: звук. Цвет в OKLCH (culori). Supabase по желанию.",
      en: "Vanilla JS, Canvas 2D. MediaPipe Hands running locally over WebAssembly. Tone.js for procedural synthesis. Color calculations in OKLCH via Culori. Optional Supabase backend.",
    },
  },
  {
    kind: "dev",
    title: { ru: "Усадебки", en: "Usadebki" },
    pet: true,
    role: {
      ru: "автор + fullstack · открытая картотека усадеб",
      en: "creator + fullstack · open registry of Russian estates",
    },
    url: "https://usadebki-beta.vercel.app/?region=76&page=2",
    curious: {
      ru: "В государственных реестрах тысячи усадеб лежат сухими строками: без фото, без координат и без понимания, уцелел ли дом. Мне хотелось вернуть этим местам объём — собрать в одну картотеку официальный реестр, статьи Википедии, снимки и карту. А главное — дать возможность дополнять досье по книгам и краеведческим источникам. Проект живой и задуман вдолгую.",
      en: "Thousands of historic country estates sit buried inside government registries as sterile spreadsheets — lacking photos, precise coordinates, or any clue whether the house is even still standing. I built Usadebki to give these places a living presence: uniting official cultural heritage records with Wikimedia archives, photography, and an interactive map. Most importantly, anyone can contribute verified facts backed by bibliographic sources. This is a personal long-term project that will keep evolving.",
    },
    hr: {
      ru: "Государственный реестр объектов культурного наследия содержит тысячи разрозненных записей: флигели оторваны от ансамблей, нет фотографий и статуса сохранности. Я спроектировал и разработал платформу с нуля: написал конвейер импорта и сборки графа ансамблей из 100k+ записей реестра, настроил обогащение через Wikidata SPARQL и Википедию (архитекторы, стили, исторические губернии, свободные фото Commons). Реализовал строгий краудсорсинг правок с обязательной библиографической ссылкой, бесконечную ленту с сохранением позиции скролла и векторную карту на MapLibre. Сервис запущен в бете на Vercel и Neon Postgres с каталогом усадеб по 80+ регионам.",
      en: "Official cultural heritage registries catalog thousands of historic estates, but the data is fragmented: outbuildings are detached from primary manors, coordinates are imprecise, and photos are absent. I designed and engineered an open platform from scratch: built an import and graph-reconstruction pipeline over 100k+ registry records, wired up automated enrichment via Wikidata SPARQL and Wikipedia (architects, historical styles, Wikimedia Commons photos), and implemented verified crowdsourced contributions requiring citation sources. Deployed a live beta on Vercel and Neon Postgres with full-text search, map navigation, and catalog filters across 80+ regions.",
    },
    tech: {
      ru: "Next.js 16 (App Router), React 19, TypeScript. PostgreSQL (Neon / Docker) + Drizzle ORM: схема с разделением неизменяемого паспорта реестра и пользовательских правок. Скрипты сборки графа: сведение разрозненных объектов в ансамбли. Wikidata SPARQL API: обогащение персоналиями и стилями. MapLibre GL + Carto basemaps: легковесная карта без тяжёлых SDK. Семантический CSS без раздутых UI-библиотек.",
      en: "Next.js 16 (App Router), React 19, TypeScript. PostgreSQL (Neon / Docker) with Drizzle ORM: normalized schema separating immutable government records from crowdsourced contributions. Two-pass import pipeline reconstructing ensemble hierarchies from raw dumps. Wikidata SPARQL API for automated biographical and architectural enrichment. MapLibre GL with Carto vector basemaps for a lean spatial UI. Pure semantic CSS with zero UI library bloat.",
    },
  },
  {
    kind: "art",
    title: { ru: "NoHome", en: "NoHome" },
    role: {
      ru: "разработка · сайт-квест с художницей из Парижа",
      en: "engineering · narrative quest with a Paris-based artist",
    },
    url: "https://nohome-next.vercel.app/",
    curious: {
      ru: "Сайт-квест про виртуальный дом: комнаты, рюкзак, телефон с экраном блокировки, дневник, плеер. Я работал рядом с художницей из Парижа. Она придумывала мир, а я искал способ, чтобы в браузере он вёл себя так, как задумано.",
      en: "An interactive narrative web experience exploring a virtual home: navigable rooms, inventory, an interactive smartphone interface, diary entries, and a music player. Built in close collaboration with a Paris-based multimedia artist — translating her visual universe into fluid browser interactions.",
    },
    hr: {
      ru: "Художественный проект требует иного подхода, чем визитка: каждая вещь часть замысла, а перевод и мобильные устройства не должны его ломать. Я реализовал замысел художницы: пять комнат с навигацией по карте, предметы-сценарии, режим x-ray и отдельную мобильную версию. Рабочая версия доступна онлайн.",
      en: "Unlike standard websites, narrative digital art treats every UI component as part of the story, making responsive design and multilingual support unusually delicate. Brought the artist's concept to life: five interactive environments connected by an SVG architectural map, context-driven item behaviors, an x-ray viewport, and a dedicated mobile experience.",
    },
    tech: {
      ru: "WordPress, своя тема. Vanilla JS-модули на событиях. Навигация по SVG-скелету дома. Google Translate: 50+ языков. Мобильная версия отдельно, прогнал в Playwright на iPhone SE и 13.",
      en: "Headless WordPress with a bespoke theme. Event-driven modular Vanilla JS. Spatial navigation over an SVG architectural wireframe. 50+ language localization. Automated cross-device testing with Playwright (targeting iPhone SE and modern viewports).",
    },
  },
  {
    kind: "art",
    title: { ru: "Before Life | After Life", en: "Before Life | After Life" },
    role: {
      ru: "разработка · сайт к арт-проекту",
      en: "engineering · digital archive for an art installation",
    },
    url: "https://illiagoncharov.github.io/before-life-after-life/",
    curious: {
      ru: "Арт-проект о личных архивах и искусственном интеллекте. Концепция принадлежит художнику Андрею Лопатину, сайт разработал я. Около шестидесяти человек из разных стран прислали свои архивы, и мне было важно, чтобы каждый мог найти себя на сайте.",
      en: "A research and art project exploring personal archives and generative AI, conceived by artist Andrei Lopatin. I designed and engineered the web archive. Around sixty contributors from across the globe submitted materials, and the focus was giving each individual submission its rightful space.",
    },
    hr: {
      ru: "Инсталляция существует только в зале, а архивы нужно было собрать у людей по всему миру и сохранить после выставки. Я сделал сайт-хаб: галерея, тексты, фильтры по запросам и авторам, форма отправки архива с отдельным согласием на публикацию. В проекте участвуют около шестидесяти человек, а сайт работает без собственного сервера.",
      en: "While the physical installation existed only on-site, the archive needed to crowdsource submissions internationally and outlast the exhibition run. I developed a serverless digital hub featuring multi-faceted filtering (by prompt and contributor), text dossiers, and an intake form with integrated consent management.",
    },
    tech: {
      ru: "React 19, CSS Modules. Cloudinary: загрузка картинок из браузера. EmailJS: анкета на почту без бэкенда. Gallery, Text, By Prompt, By Contributor: фильтры одних данных. GitHub Pages через gh-pages.",
      en: "React 19, CSS Modules. Direct client-to-cloud uploads via Cloudinary. Serverless submission routing via EmailJS. Normalized client-side data store with cross-dimensional filtering. Hosted on GitHub Pages.",
    },
  },
  {
    kind: "pm",
    title: {
      ru: "Школа и галерея искусств",
      en: "Art school and gallery",
    },
    role: {
      ru: "продакт · учёт оплат и зарплат, читаю код",
      en: "product manager · billing and payroll system, hands-on code",
    },
    url: "",
    curious: {
      ru: "Клиент пришёл с задачей про поиск и SEO, но за разговором стояла другая проблема: оплаты, рассрочки и зарплаты преподавателей жили в таблицах. Я предложил три варианта работы, клиент выбрал средний. Сейчас строим систему учёта, и демо уже приняли.",
      en: "The client initially asked for SEO audits, but discovery uncovered the real operational bottleneck: tuition, installments, and teacher payroll were trapped in brittle spreadsheets. I framed three implementation scopes, aligned on the balanced tier, and delivered a working operations platform that has already passed milestone acceptance.",
    },
    hr: {
      ru: "Учёт школы и галереи держался на четырёх таблицах: 35 листов заявок в четырёх форматах, 16 вариантов статуса, зарплаты на шести листах. Вместо готовой CRM я начал с аудита процесса: пять встреч, журнал из 34 решений, три варианта работы и договор на четыре этапа. Первый контур уже собран (записи, рассрочки, долги, расчёт зарплат), и клиент принял демо.",
      en: "The business was held together by sprawling spreadsheets: 35 application sheets in conflicting formats, 16 duplicate status types, and payroll split across six tabs. Rather than forcing an ill-fitting generic CRM, I conducted an operational audit: logged 34 process decisions, scoped a phased contract, and built the core loop (admissions, payment plans, balance calculation, teacher compensation). The initial release was demoed and accepted.",
    },
    tech: {
      ru: "Next.js 16, React 19, TypeScript, Tailwind, shadcn/ui. PostgreSQL и Prisma 7. Деньги в Decimal. Enrollment со статусом вместо отдельных таблиц. Долг считается, а не хранится. Расчёты в чистых функциях с тестами (vitest). NextAuth: ставки видит только owner. Docker, Caddy, автодеплой на VPS в РФ.",
      en: "Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui. PostgreSQL, Prisma 7. Arbitrary-precision Decimals for financial calculations. Unified state machine for enrollments instead of fragmented tables. Real-time balance derivation over stored balances. Pure accounting logic verified with Vitest. Role-based NextAuth protecting compensation rates. Docker, Caddy, automated CI/CD to a self-hosted VPS.",
    },
  },
  {
    kind: "pm",
    title: { ru: "Студия Лебедева", en: "Art. Lebedev Studio" },
    role: {
      ru: "руководитель проекта · крупный фестиваль",
      en: "project lead · flagship cultural festival",
    },
    url: "https://www.artlebedev.ru/people/rdjF4c/",
    curious: {
      ru: "Фестиваль и несколько человек, у которых последнее слово. Я вёл проект и согласовывал каждый этап. Работа вышла на сайте студии как референс, и это один из итогов, которыми я горжусь.",
      en: "A major festival with multiple executive stakeholders who each held veto power. I led project delivery, managing requirements and securing alignment at every milestone. The finished project was selected for the studio’s official portfolio as a reference case.",
    },
    hr: {
      ru: "Экономический фестиваль, несколько лиц принимают решения, и объём легко расползается. Я согласовывал объём, сроки и договорённости на каждом этапе и параллельно вёл ещё два веб-проекта. Работа принята и опубликована на сайте студии как референс.",
      en: "A high-profile economics festival with competing stakeholder priorities and high risk of scope creep. Managed scope, timeline, and dependencies across every milestone while running two concurrent web initiatives. Successfully delivered and featured as a benchmark project in Art. Lebedev Studio’s portfolio.",
    },
    tech: { ru: "", en: "" },
  },
  {
    kind: "pm",
    title: { ru: "Century 21", en: "Century 21" },
    role: {
      ru: "лид внедрения цифровых решений",
      en: "digital transformation lead",
    },
    url: "https://www.century21.ru",
    curious: {
      ru: "Пятьдесят франчайзи, и у каждого своё представление о том, как внедрять новое. Я собрал единую методику и обучил команды, чтобы партнёры пользовались ею сами, а не только в момент запуска.",
      en: "Fifty independent franchisees, each with their own ingrained habits. I established a standardized operational playbook and trained regional teams so adoption lasted well beyond the initial launch phase.",
    },
    hr: {
      ru: "Более пятидесяти франчайзи, у каждого отдельное внедрение: дорого, и результат не закрепляется. Я разработал единую методику работы с цифровыми сервисами и обучил команды партнёров. Сеть перешла от разовых внедрений к регулярному использованию.",
      en: "Across 50+ franchise offices, disconnected rollouts were driving up costs without creating lasting change. Formulated a unified digital services framework, conducted enablement workshops, and shifted the network from sporadic ad-hoc rollouts to consistent daily product usage.",
    },
    tech: { ru: "", en: "" },
  },
  {
    kind: "pm",
    title: {
      ru: "Библиотека в Ташкенте",
      en: "Library in Tashkent",
    },
    role: {
      ru: "координатор проекта · поставка оборудования",
      en: "project coordinator · infrastructure procurement",
    },
    url: "",
    curious: {
      ru: "Дату открытия библиотеки назначили на 1 сентября, и сдвинуть её было нельзя. Я вёл переписку с тремя поставщиками на английском и добился скидки 40%. Открылись вовремя.",
      en: "The library opening date was fixed for September 1st with zero room for slippage. Negotiated complex international vendor contracts in English, secured a 40% hardware discount, and hit the opening deadline on schedule.",
    },
    hr: {
      ru: "Библиотеку нужно было открыть к 1 сентября 2023, оборудование шло от нескольких поставщиков, переписка велась на английском. Я параллельно вёл три переписки, включая Cisco и HPE, по деловым правилам США. Открытие состоялось в срок, а на оборудование удалось получить максимальную скидку 40%.",
      en: "Coordinated mission-critical IT infrastructure delivery under a hard September 1 deadline. Managed concurrent enterprise procurement tracks with Cisco and HPE partners, navigating US commercial contracts and securing a top-tier 40% discount on equipment.",
    },
    tech: {
      ru: "Согласование поставки оборудования Cisco и HPE.",
      en: "Enterprise hardware procurement with Cisco and HPE.",
    },
  },
  {
    kind: "pm",
    title: { ru: "JULO", en: "JULO" },
    role: {
      ru: "менеджер цифрового продукта · запуск агентства",
      en: "product manager · agency co-founder",
    },
    url: "https://julo.agency",
    curious: {
      ru: "Мы запускали агентство вдвоём с партнёром: ни офиса, ни входящих заявок, ни репутации. Клиентов находили через личные знакомства. Это был честный курс продаж и работы с ожиданиями.",
      en: "Co-founded a digital studio from scratch: no office, zero inbound pipeline, and no prior brand reputation. Sourced all initial accounts through direct networking — a crash course in consultative selling and expectations management.",
    },
    hr: {
      ru: "Агентство запускали без входящего потока и без имени. Я выстроил личные продажи и работу без офиса. Агентство вышло на стабильную работу.",
      en: "Bootstrapped the agency from zero inbound recognition into a self-sustaining remote business through founder-led sales and systematic project execution.",
    },
    tech: { ru: "", en: "" },
  },
  {
    kind: "study",
    title: { ru: "Stellar Burgers", en: "Stellar Burgers" },
    role: {
      ru: "учебный проект · фронтенд",
      en: "coursework · frontend engineering",
    },
    url: "https://github.com/illiaGoncharov/react-burger",
    curious: {
      ru: "Учебное приложение: бургер собирается перетаскиванием, а статус заказа обновляется в реальном времени.",
      en: "An interactive burger-builder interface featuring drag-and-drop customization and live order tracking over WebSocket.",
    },
    hr: {
      ru: "Учебный проект Практикума, не коммерческий продукт. Показывает, как я строю интерфейс с живыми статусами.",
      en: "Praktikum engineering project. Demonstrates complex client-side state, drag-and-drop mechanics, and persistent WebSocket connection management.",
    },
    tech: {
      ru: "React, TypeScript, Redux Toolkit. WebSocket: статусы без перезагрузки. Drag-and-drop: сборка бургера.",
      en: "React, TypeScript, Redux Toolkit. WebSocket event streams for live order telemetry. HTML5 Drag and Drop API.",
    },
  },
  {
    kind: "study",
    title: { ru: "Mesto", en: "Mesto" },
    role: {
      ru: "учебный проект · бэкенд",
      en: "coursework · backend engineering",
    },
    url: "https://github.com/illiaGoncharov/mesto-project-plus",
    curious: {
      ru: "Учебный бэкенд для мини-соцсети: карточки мест, лайки, профиль пользователя.",
      en: "A RESTful backend service for a photo-sharing micro-social app: card feeds, likes, user authentication, and profile management.",
    },
    hr: {
      ru: "Учебный бэкенд: API собирал сам, ревьюер проверял каждую итерацию.",
      en: "Praktikum backend capstone. Built out idiomatic REST endpoints, input sanitization, layered domain logic, and automated schema validation with continuous code review.",
    },
    tech: {
      ru: "TypeScript, Express, MongoDB. Роуты и модели по слоям. Валидация на входе.",
      en: "TypeScript, Express, MongoDB/Mongoose. Layered controller/service architecture. Request validation with celebrate/Joi, centralized error handling.",
    },
  },
  {
    kind: "note",
    guide: true,
    title: { ru: "Я", en: "Me" },
    role: {
      ru: "продакт + инженер · о себе",
      en: "product + engineer · about me",
    },
    url: "",
    curious: {
      ru: "Мне всегда было сложно выбрать: придумать, зачем штука нужна людям, или сесть и собрать её руками. Поэтому делаю и то, и другое. Люблю, когда сложная инженерная часть снаружи выглядит простой и спокойной — как этот сайт. Можно кликать по кубикам, включать ритмы внизу или просто залипать, как они парят.",
      en: "I've never been able to pick between product intuition and hands-on engineering: figuring out why something should exist, or sitting down and building it from scratch. So I do both. I like it when complex technical architecture feels effortless and calm on the surface — like this site. Feel free to click around, trigger the soundscape below, or just watch the constellation drift.",
    },
    hr: {
      ru: "Шесть лет соединяю продуктовое управление и веб-разработку: вёл проекты в Студии Лебедева, выстраивал международный чекаут под санкциями, переводил бардак в таблицах в аккуратные CRM и собирал веб-VR для выставок. Хорошо держу неопределённость, умею слышать клиента и доводить сырую задачу до продакшена. Не бросаю на полпути.",
      en: "Six years working at the intersection of product management and full-stack engineering: delivered flagship client projects at Art. Lebedev Studio, architected resilient multi-gateway checkouts, replaced spreadsheet sprawl with tailored internal tooling, and shipped interactive WebXR for museum exhibitions. Comfortable navigating ambiguity, quick to translate business needs into technical scope, and committed to shipping to production. I see things through.",
    },
    tech: {
      ru: "Стек: TypeScript, React, Next.js, Node.js, Express, Three.js, PostgreSQL, Prisma, Docker. Строгая типизация, слои и валидация на входе. Ценю лёгкость: если задачу решает нативный Canvas или три строки CSS, не тащу тяжёлый фреймворк. В разработку приношу продуктовую оптику: умею срезать лишний скоуп ещё до первой строчки кода и перевожу сырые хотелки бизнеса в простую архитектуру, без космолётов.",
      en: "Core stack: TypeScript, React, Next.js, Node.js, Express, Three.js, PostgreSQL, Prisma, Docker. Strict typing, layered services, and boundary validation. I value lean abstractions: if native Canvas or three lines of CSS solves the problem cleanly, I won't pull in a bloated dependency. What I bring to engineering is a strong product lens: trimming unnecessary scope before writing a line of code, and shaping raw business goals into pragmatic architecture without overengineering.",
    },
  },
  {
    kind: "note",
    title: { ru: "Точка", en: "Dot" },
    url: "",
    curious: {
      ru: "Просто точка, без особого смысла.",
      en: "Just a dot, for no particular reason.",
    },
    hr: { ru: "", en: "" },
    tech: { ru: "", en: "" },
  },
  {
    kind: "note",
    title: {
      ru: "Черновик: Фасадоход",
      en: "Draft: Facade Walk",
    },
    url: "",
    curious: {
      ru: "Идея, которая пока не стала проектом. Вы гуляете по городу, находите на фасаде архитектурную деталь, например метопу или сандрик, фотографируете, и она попадает в вашу коллекцию. Чем реже находка, тем больше очков. Из двадцати деталей можно собрать собственный фасад: строго исторический или с готическим карнизом и башней модерна.",
      en: "An idea waiting to become a project. You walk around the city, photograph architectural ornaments on historical facades — say, a frieze metope or a cornice pediment — and add them to your collection. The rarer the find, the higher the score. Collect enough elements, and you can compose your own fictional facade: strictly neoclassical, or blending a Gothic cornice with an Art Nouveau turret.",
    },
    hr: {
      ru: "Идея: сохранить то, что исчезает из городского ландшафта, и превратить прогулку в игру. MVP: карта, камера, каталог находок, 2D-конструктор фасада. Начать с одного района и ручной классификации.",
      en: "Concept: gamifying urban exploration while documenting vulnerable architectural heritage. MVP roadmap: geolocation map, camera capture, classified catalog of details, and a 2D facade builder. Scoped to pilot in one historical district with human-curated labeling.",
    },
    tech: {
      ru: "Пока мысль. React Native и Expo. Firebase на старте. TensorFlow Lite или Teachable Machine. Конструктор на react-native-svg. Админка на Retool.",
      en: "Architecture sketch: React Native with Expo. Firebase backend for rapid prototyping. Edge classification with TensorFlow Lite or Teachable Machine. Visual builder on react-native-svg. Internal admin dashboard on Retool.",
    },
  },
  {
    kind: "note",
    title: {
      ru: "Черновик: косметический помощник",
      en: "Draft: Cosmetics Helper",
    },
    url: "",
    curious: {
      ru: "Ещё одна идея, пока на уровне заметки. Вводишь косметическое средство, из аптеки или из магазина, и получаешь список аналогов. Можно указать, чего в составе быть не должно, и подборка исключит всё, где этот компонент есть.",
      en: "An idea still in my notebook. You look up a skincare or cosmetic product and get comparable alternatives matched by formulation. Flag allergens or unwanted ingredients, and the recommendations filter them out automatically.",
    },
    hr: {
      ru: "Идея: подбирать аналоги косметики по составу с учётом личных ограничений. MVP: поиск средства, список аналогов по составу, фильтр для исключения нежелательного компонента.",
      en: "Concept: ingredient-based cosmetic product matching with dietary and allergy constraints. MVP scope: searchable product directory, formula similarity ranking, and negative ingredient filters.",
    },
    tech: {
      ru: "Пока мысль. Нужна база составов и сопоставление ингредиентов. Платформа и стек ещё не выбраны.",
      en: "Early discovery: requires a structured INCI ingredient database and fuzzy formula similarity scoring. Tech stack to be determined.",
    },
  },
  {
    kind: "link",
    title: { ru: "GitHub", en: "GitHub" },
    url: "https://github.com/illiaGoncharov",
    curious: {
      ru: "Код, учебные и личные проекты. Всё, что можно показать, открыто.",
      en: "Public repositories: personal projects, experiments, and coursework. Open by default.",
    },
    hr: { ru: "", en: "" },
    tech: {
      ru: "Публичные репозитории. Закрытые клиентские проекты и NDA сюда не входят.",
      en: "Open-source work. Proprietary client code and NDA projects are kept private.",
    },
  },
  {
    kind: "link",
    title: { ru: "Telegram", en: "Telegram" },
    url: "https://t.me/binarygraph",
    curious: {
      ru: "Самый быстрый способ связаться.",
      en: "The quickest way to reach me.",
    },
    hr: { ru: "", en: "" },
    tech: { ru: "", en: "" },
  },
  {
    kind: "link",
    title: { ru: "Почта", en: "Email" },
    url: "mailto:ilia.m.goncharov@gmail.com",
    curious: {
      ru: "Если разговор не помещается в три сообщения.",
      en: "For conversations that need more than a quick message.",
    },
    hr: { ru: "", en: "" },
    tech: { ru: "", en: "" },
  },
];

export const DOSSIER = [
  { key: "curious", label: { ru: "для любопытных", en: "for the curious" } },
  { key: "hr", label: { ru: "для нанимающих", en: "for hr" } },
  { key: "tech", label: { ru: "для инженеров", en: "for engineers" } },
];

/** Берёт строку текущего языка из поля { ru, en } или обычной строки. */
export function pick(field, lang) {
  if (field == null) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.ru || "";
}

/** Слой есть, если хотя бы на одном языке не пустой. */
export function hasLayer(field) {
  if (!field) return false;
  if (typeof field === "string") return Boolean(field);
  return Boolean(field.ru || field.en);
}
