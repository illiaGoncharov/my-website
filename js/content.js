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
      en: "A type foundry sells worldwide, but payments from Russia kept failing. I worked on giving every buyer their own path to checkout: one for Russia, another for the rest of the world. The best outcome here is the one nobody notices.",
    },
    hr: {
      ru: "После санкций международные платёжные провайдеры перестали принимать карты из России, а магазин шрифтов продаёт по всему миру. Я выстроил два независимых платёжных контура с автоматическим выбором по региону и языку и запустил их вместе с владельцами: оферта, возвраты, тестовый чек-лист. Закрыто 37 сбоев оплаты, а Sentry показывает ошибки чекаута раньше, чем о них сообщит покупатель.",
      en: "After sanctions, international payment providers stopped accepting cards from Russia, while the shop sells fonts worldwide. I built two independent payment paths, chosen automatically by region and language, and launched them with the owners: offer, refunds, test checklist. 37 payment failures are closed, and Sentry shows checkout errors before a customer reports them.",
    },
    tech: {
      ru: "Next.js 15, React 19, TypeScript. Sanity: владельцы правят тексты и цены сами. Zustand: корзина. Stripe, ЮKassa, FastSpring и Lemon Squeezy за одним интерфейсом. Товары во FastSpring создаются при первой покупке. Sentry: сбои видно сразу. Nginx-прокси с российским IP: Vercel открывался через раз.",
      en: "Next.js 15, React 19, TypeScript. Sanity so owners edit copy and prices. Zustand for the cart. Stripe, YooKassa, FastSpring, and Lemon Squeezy behind one interface. FastSpring products are created on first purchase. Sentry for payment failures. Nginx proxy on a Russian IP: Vercel was flaky from there.",
    },
  },
  {
    kind: "dev",
    title: { ru: "Banena", en: "Banena" },
    role: {
      ru: "разработка · клиентский сайт",
      en: "development · client site",
    },
    url: "https://banena.ru/",
    curious: {
      ru: "Фотографу было важно, чтобы снимки читались серией, а не набором картинок. Поэтому на сайте два режима, плёнка и сетка, а лайтбокс я написал сам, чтобы интерфейс не спорил с кадрами. Вёл проект от макета до публикации.",
      en: "The photographer wanted frames to read as a series, not a pile of pictures. So the site has two modes, filmstrip and grid, and I wrote the lightbox myself so the interface never argues with the photos. I took it from layout to launch.",
    },
    hr: {
      ru: "Серию снимков нужно было показать целиком, и сайт должен был одинаково открываться для посетителей, в том числе из России. Я сделал два режима просмотра, собственный просмотрщик со свайпами и подготовку изображений, затем довёл сайт до публикации. Он работает у клиента в эксплуатации.",
      en: "A photo series had to be shown as a whole, and the site had to open reliably for visitors, including from Russia. I built two viewing modes, a custom viewer with swipe, and an image pipeline, then took the site to launch. It is live for the client.",
    },
    tech: {
      ru: "Next.js 14, TypeScript, Tailwind. sharp режет фото до 1920 и в WebP. Свой лайтбокс и свайпы без тяжёлой библиотеки. Скрипты Cloudflare и деплоя: открывается из РФ и выкладывается одной командой.",
      en: "Next.js 14, TypeScript, Tailwind. sharp resizes to 1920 and WebP. Custom lightbox and swipe without a heavy gallery library. Cloudflare and deploy scripts so it opens from Russia and ships with one command.",
    },
  },
  {
    kind: "dev",
    title: { ru: "Greenwich", en: "Greenwich" },
    role: {
      ru: "продакт + разработка · галерея в Англии",
      en: "product + development · gallery in England",
    },
    url: "https://illiagoncharov.github.io/greenwich/",
    curious: {
      ru: "Галерея из Великобритании, и всё общение на английском: от требований до защиты макета. Мне было интересно вести проект на чужом языке и пройти путь от первого брифа до запуска.",
      en: "A gallery from the UK, with everything in English, from requirements to the layout pitch. I enjoyed running a project in a second language and taking it from the first brief to launch.",
    },
    hr: {
      ru: "Заказчик из Великобритании пришёл с расплывчатыми требованиями на английском. Я уточнил задачу, сделал макет в Figma, защитил концепцию на английском и организовал разработку и SEO. Проект дошёл до запуска.",
      en: "A UK client came with vague requirements in English. I clarified the brief, designed the layout in Figma, pitched the concept in English, and coordinated the build and SEO. The project reached launch.",
    },
    tech: {
      ru: "Next.js 16, React 19, TypeScript, Tailwind 4. Анимации на CSS: без библиотеки ради одного экрана. SVG: не мылится при масштабе.",
      en: "Next.js 16, React 19, TypeScript, Tailwind 4. CSS animation so a one-screen motion needs no library. SVG so art stays sharp at any size.",
    },
  },
  {
    kind: "dev",
    title: { ru: "Appyland", en: "Appyland" },
    role: {
      ru: "разработка · командный промо-сайт",
      en: "development · team promo site",
    },
    url: "https://appyland.ru/",
    curious: {
      ru: "Промо-сайт с анимацией, который собирает команда. Мой вклад в том, что тяжёлые картинки и сборка под разные площадки делаются скриптами, а не руками. Эту работу не видно на сайте, но команда её чувствует.",
      en: "A promo site with animation, built by a team. My part is that heavy images and builds for different hosts are handled by scripts, not by hand. You will not see that work on the site, but the team feels it.",
    },
    hr: {
      ru: "Команда делала тяжёлый промо-сайт с анимациями, и подготовка картинок занимала много ручной работы. Я автоматизировал оптимизацию изображений и сборку под разные площадки. Команда освободилась от рутины и занялась самим продуктом.",
      en: "A team was building a heavy animated promo site, and image preparation took a lot of manual work. I automated image optimization and builds for different hosts. The team was freed from routine and could focus on the product itself.",
    },
    tech: {
      ru: "Vite 7. sharp: скрипт переводит картинки из Lottie в WebP. Две сборки с разным базовым путём: GitHub Pages и хостинг.",
      en: "Vite 7. sharp script turns Lottie images into WebP. Two builds with different base paths: GitHub Pages and hosting.",
    },
  },
  {
    kind: "dev",
    title: { ru: "Самокат × Blazar", en: "Samokat × Blazar" },
    role: {
      ru: "продакт + разработка · Музей Москвы",
      en: "product + development · Museum of Moscow",
    },
    url: "https://github.com/illiaGoncharov/samokat-art",
    curious: {
      ru: "К выставке в Музее Москвы (Самокат × Blazar) в сжатый срок шли четыре веб-части одной истории. Самый напряжённый кусок — промокоды и API под поток посетителей. Два других контура мы упростили по гайдлайнам Самоката, чтобы успеть четвёртый: веб-VR по QR для работы художницы.",
      en: "For an exhibition at the Museum of Moscow (Samokat × Blazar), four web pieces of one story had to ship on a tight deadline. The hottest part was promo codes and an API for visitor traffic. We streamlined two other surfaces to Samokat guidelines so we could ship the fourth: web VR via QR for an artist's work.",
    },
    hr: {
      ru: "К выставке в Музее Москвы (Самокат × Blazar) в сжатые сроки нужно было отдать четыре веб-части. Я спроектировал структуру и REST API для сценария с промокодами, который должен стабильно работать при публичной нагрузке, и согласовал материалы с регламентами Самоката. Два промо-контура оптимизировал и привёл к гайдлайнам, чтобы высвободить время на четвёртый: веб-VR-инсталляцию для художницы. Сравнил варианты технологий, собрал VR-сцену на Three.js; посетители заходили в историю по QR. Всё уложилось в срок.",
      en: "For the Museum of Moscow exhibition (Samokat × Blazar), four web deliverables had to ship on a tight timeline. I designed the structure and a REST API for promo-code flows that had to hold up under public load, and aligned materials with Samokat brand rules. I optimized two promo surfaces to guidelines to free time for the fourth: a web VR piece for an artist. I compared technology options, built the VR scene in Three.js, and visitors entered the story via QR. Everything met the deadline.",
    },
    tech: {
      ru: "React на фронте. REST API: промокоды и выдача контента, эндпойнты под пиковую нагрузку в дни выставки. Два промо-контура: оптимизация и соответствие гайдлайнам Самоката. VR: Three.js в браузере, вход по QR.",
      en: "React on the front end. REST API for promo codes and content delivery, endpoints shaped for peak load on busy exhibition days. Two promo surfaces: performance and Samokat guideline compliance. VR: Three.js in the browser, entry via QR.",
    },
  },
  {
    kind: "dev",
    title: { ru: "sfumato", en: "sfumato" },
    pet: true,
    role: {
      ru: "инженер + продуктовая идея · свой эксперимент",
      en: "engineer + product idea · personal experiment",
    },
    url: "https://illiaGoncharov.github.io/sfumato/",
    curious: {
      ru: "Хотелось выяснить, можно ли собирать слова жестами руки прямо в браузере. Оказалось, можно: камера работает локально, видео никуда не отправляется. Это мой эксперимент от идеи до звука, и позже из него вырос этот сайт.",
      en: "I wanted to find out whether you can gather words with hand gestures right in the browser. You can: the camera runs locally and video goes nowhere. It is my experiment from idea to sound, and this site grew out of it.",
    },
    hr: {
      ru: "Хотел проверить гипотезу: можно ли управлять сайтом жестами без установки и без отправки видео. Спроектировал и собрал прототип с локальным распознаванием руки, звуком и собственной цветовой системой. Он работает в браузере, и из него вырос этот сайт.",
      en: "I wanted to test a hypothesis: can a site be driven by gestures with no install and no video upload? I designed and built a prototype with on-device hand tracking, sound, and its own color system. It runs in the browser, and this site grew out of it.",
    },
    tech: {
      ru: "Vanilla JS и Canvas 2D. MediaPipe Hands через WebAssembly, локально. Tone.js: звук. Цвет в OKLCH (culori). Supabase по желанию.",
      en: "Vanilla JS and Canvas 2D. MediaPipe Hands via WebAssembly, on-device. Tone.js for sound. Color in OKLCH (culori). Supabase optional.",
    },
  },
  {
    kind: "art",
    title: { ru: "NoHome", en: "NoHome" },
    role: {
      ru: "разработка · сайт-квест с художницей из Парижа",
      en: "development · quest site with a Paris-based artist",
    },
    url: "https://nohome-next.vercel.app/",
    curious: {
      ru: "Сайт-квест про виртуальный дом: комнаты, рюкзак, телефон с экраном блокировки, дневник, плеер. Я работал рядом с художницей из Парижа. Она придумывала мир, а я искал способ, чтобы в браузере он вёл себя так, как задумано.",
      en: "A quest site about a virtual house: rooms, a backpack, a phone with a lock screen, a diary, a player. I worked alongside an artist in Paris. She imagined the world, and I looked for a way to make it behave in the browser as intended.",
    },
    hr: {
      ru: "Художественный проект требует иного подхода, чем визитка: каждая вещь часть замысла, а перевод и мобильные устройства не должны его ломать. Я реализовал замысел художницы: пять комнат с навигацией по карте, предметы-сценарии, режим x-ray и отдельную мобильную версию. Рабочая версия доступна онлайн.",
      en: "An art project calls for a different approach than a brochure site: every object is part of the idea, and translation or phones must not break it. I built the artist's concept: five rooms with map navigation, object scenes, an x-ray mode, and a separate mobile version. A working version is online.",
    },
    tech: {
      ru: "WordPress, своя тема. Vanilla JS-модули на событиях. Навигация по SVG-скелету дома. Google Translate: 50+ языков. Мобильная версия отдельно, прогнал в Playwright на iPhone SE и 13.",
      en: "WordPress with a custom theme. Vanilla JS modules on events. Navigation over an SVG house skeleton. Google Translate for 50+ languages. Separate mobile build, checked in Playwright on iPhone SE and 13.",
    },
  },
  {
    kind: "art",
    title: { ru: "Before Life | After Life", en: "Before Life | After Life" },
    role: {
      ru: "разработка · сайт к арт-проекту",
      en: "development · site for an art project",
    },
    url: "https://illiagoncharov.github.io/before-life-after-life/",
    curious: {
      ru: "Арт-проект о личных архивах и искусственном интеллекте. Концепция принадлежит художнику Андрею Лопатину, сайт разработал я. Около шестидесяти человек из разных стран прислали свои архивы, и мне было важно, чтобы каждый мог найти себя на сайте.",
      en: "An art project about personal archives and artificial intelligence. The concept belongs to the artist Andrei Lopatin; I built the site. About sixty people from different countries sent their archives, and it mattered to me that each of them could find themselves on the site.",
    },
    hr: {
      ru: "Инсталляция существует только в зале, а архивы нужно было собрать у людей по всему миру и сохранить после выставки. Я сделал сайт-хаб: галерея, тексты, фильтры по запросам и авторам, форма отправки архива с отдельным согласием на публикацию. В проекте участвуют около шестидесяти человек, а сайт работает без собственного сервера.",
      en: "The installation exists only in a room, while archives had to be gathered from people worldwide and kept after the show. I built a hub: gallery, texts, filters by prompt and contributor, and a submission form with a separate consent to publish. About sixty people took part, and the site runs without a custom server.",
    },
    tech: {
      ru: "React 19, CSS Modules. Cloudinary: загрузка картинок из браузера. EmailJS: анкета на почту без бэкенда. Gallery, Text, By Prompt, By Contributor: фильтры одних данных. GitHub Pages через gh-pages.",
      en: "React 19, CSS Modules. Cloudinary for in-browser image upload. EmailJS for the form with no backend. Gallery, Text, By Prompt, By Contributor as filters over the same data. GitHub Pages via gh-pages.",
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
      en: "product · tuition and payroll tracking, I read the code",
    },
    url: "",
    curious: {
      ru: "Клиент пришёл с задачей про поиск и SEO, но за разговором стояла другая проблема: оплаты, рассрочки и зарплаты преподавателей жили в таблицах. Я предложил три варианта работы, клиент выбрал средний. Сейчас строим систему учёта, и демо уже приняли.",
      en: "The client came with a search and SEO request, but behind the conversation was a different problem: payments, installments, and teacher payroll lived in spreadsheets. I offered three scopes and the client picked the middle one. We are building an accounting system now, and the demo has been accepted.",
    },
    hr: {
      ru: "Учёт школы и галереи держался на четырёх таблицах: 35 листов заявок в четырёх форматах, 16 вариантов статуса, зарплаты на шести листах. Вместо готовой CRM я начал с аудита процесса: пять встреч, журнал из 34 решений, три варианта работы и договор на четыре этапа. Первый контур уже собран (записи, рассрочки, долги, расчёт зарплат), и клиент принял демо.",
      en: "The school and gallery ran on four spreadsheets: 35 application sheets in four formats, 16 status spellings, and payroll across six sheets. Instead of an off-the-shelf CRM, I started with a process audit: five meetings, a log of 34 decisions, three scopes, and a four-stage contract. The first loop is built (enrollments, installments, debts, payroll) and the client accepted the demo.",
    },
    tech: {
      ru: "Next.js 16, React 19, TypeScript, Tailwind, shadcn/ui. PostgreSQL и Prisma 7. Деньги в Decimal. Enrollment со статусом вместо отдельных таблиц. Долг считается, а не хранится. Расчёты в чистых функциях с тестами (vitest). NextAuth: ставки видит только owner. Docker, Caddy, автодеплой на VPS в РФ.",
      en: "Next.js 16, React 19, TypeScript, Tailwind, shadcn/ui. PostgreSQL and Prisma 7. Money as Decimal. One Enrollment with status instead of split tables. Debt is computed, not stored. Pure calc functions with vitest. NextAuth: only owner sees rates. Docker, Caddy, auto-deploy to a VPS in Russia.",
    },
  },
  {
    kind: "pm",
    title: { ru: "Студия Лебедева", en: "Art. Lebedev Studio" },
    role: {
      ru: "руководитель проекта · крупный фестиваль",
      en: "project lead · major festival",
    },
    url: "https://www.artlebedev.ru/people/rdjF4c/",
    curious: {
      ru: "Фестиваль и несколько человек, у которых последнее слово. Я вёл проект и согласовывал каждый этап. Работа вышла на сайте студии как референс, и это один из итогов, которыми я горжусь.",
      en: "A festival and several people who hold the final say. I led the project and agreed every stage. The work went up on the studio's site as a reference, and it is one of the results I am proud of.",
    },
    hr: {
      ru: "Экономический фестиваль, несколько лиц принимают решения, и объём легко расползается. Я согласовывал объём, сроки и договорённости на каждом этапе и параллельно вёл ещё два веб-проекта. Работа принята и опубликована на сайте студии как референс.",
      en: "An economic festival with several decision-makers, where scope easily drifts. I agreed scope, timing, and terms at every stage while running two other web projects in parallel. The work was accepted and published on the studio's site as a reference.",
    },
    tech: { ru: "", en: "" },
  },
  {
    kind: "pm",
    title: { ru: "Century 21", en: "Century 21" },
    role: {
      ru: "лид внедрения цифровых решений",
      en: "lead for digital solution rollout",
    },
    url: "https://www.century21.ru",
    curious: {
      ru: "Пятьдесят франчайзи, и у каждого своё представление о том, как внедрять новое. Я собрал единую методику и обучил команды, чтобы партнёры пользовались ею сами, а не только в момент запуска.",
      en: "Fifty franchisees, each with their own idea of how to adopt something new. I built one method and trained the teams so partners use it on their own, not only at launch.",
    },
    hr: {
      ru: "Более пятидесяти франчайзи, у каждого отдельное внедрение: дорого, и результат не закрепляется. Я разработал единую методику работы с цифровыми сервисами и обучил команды партнёров. Сеть перешла от разовых внедрений к регулярному использованию.",
      en: "More than fifty franchisees, each with a one-off rollout: expensive, and the results did not stick. I built one method for working with digital services and trained partner teams. The network moved from one-off rollouts to regular use.",
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
      en: "project coordinator · equipment supply",
    },
    url: "",
    curious: {
      ru: "Дату открытия библиотеки назначили на 1 сентября, и сдвинуть её было нельзя. Я вёл переписку с тремя поставщиками на английском и добился скидки 40%. Открылись вовремя.",
      en: "The library opening was set for 1 September and could not move. I ran correspondence with three vendors in English and secured a 40% discount. We opened on time.",
    },
    hr: {
      ru: "Библиотеку нужно было открыть к 1 сентября 2023, оборудование шло от нескольких поставщиков, переписка велась на английском. Я параллельно вёл три переписки, включая Cisco и HPE, по деловым правилам США. Открытие состоялось в срок, а на оборудование удалось получить максимальную скидку 40%.",
      en: "The library had to open by 1 September 2023, with equipment from several vendors and correspondence in English. I ran three threads in parallel, including Cisco and HPE, under US business norms. The opening happened on time, and we secured the maximum 40% discount on equipment.",
    },
    tech: {
      ru: "Согласование поставки оборудования Cisco и HPE.",
      en: "Coordinating Cisco and HPE equipment supply.",
    },
  },
  {
    kind: "pm",
    title: { ru: "JULO", en: "JULO" },
    role: {
      ru: "менеджер цифрового продукта · запуск агентства",
      en: "digital product manager · agency launch",
    },
    url: "https://julo.agency",
    curious: {
      ru: "Мы запускали агентство вдвоём с партнёром: ни офиса, ни входящих заявок, ни репутации. Клиентов находили через личные знакомства. Это был честный курс продаж и работы с ожиданиями.",
      en: "My partner and I launched an agency with no office, no inbound leads, and no reputation. Clients came through personal contacts. It was an honest course in sales and managing expectations.",
    },
    hr: {
      ru: "Агентство запускали без входящего потока и без имени. Я выстроил личные продажи и работу без офиса. Агентство вышло на стабильную работу.",
      en: "The agency launched with no inbound flow and no name. I built personal sales and ran it without an office. The agency reached steady work.",
    },
    tech: { ru: "", en: "" },
  },
  {
    kind: "study",
    title: { ru: "Stellar Burgers", en: "Stellar Burgers" },
    role: {
      ru: "учебный проект · фронтенд",
      en: "study project · frontend",
    },
    url: "https://github.com/illiaGoncharov/react-burger",
    curious: {
      ru: "Учебное приложение: бургер собирается перетаскиванием, а статус заказа обновляется в реальном времени.",
      en: "A study app: you build the burger by dragging, and the order status updates in real time.",
    },
    hr: {
      ru: "Учебный проект Практикума, не коммерческий продукт. Показывает, как я строю интерфейс с живыми статусами.",
      en: "A Praktikum study project, not a commercial product. It shows how I build interfaces with live status.",
    },
    tech: {
      ru: "React, TypeScript, Redux Toolkit. WebSocket: статусы без перезагрузки. Drag-and-drop: сборка бургера.",
      en: "React, TypeScript, Redux Toolkit. WebSocket for live status. Drag-and-drop for building the burger.",
    },
  },
  {
    kind: "study",
    title: { ru: "Mesto", en: "Mesto" },
    role: {
      ru: "учебный проект · бэкенд",
      en: "study project · backend",
    },
    url: "https://github.com/illiaGoncharov/mesto-project-plus",
    curious: {
      ru: "Учебный бэкенд для мини-соцсети: карточки мест, лайки, профиль пользователя.",
      en: "A study backend for a small social app: place cards, likes, a user profile.",
    },
    hr: {
      ru: "Учебный бэкенд: API собирал сам, ревьюер проверял каждую итерацию.",
      en: "A study backend: I built the API myself, and a reviewer checked every iteration.",
    },
    tech: {
      ru: "TypeScript, Express, MongoDB. Роуты и модели по слоям. Валидация на входе.",
      en: "TypeScript, Express, MongoDB. Routes and models in layers. Validation at the edge.",
    },
  },
  {
    kind: "note",
    title: { ru: "Точка", en: "Dot" },
    url: "",
    curious: {
      ru: "Просто точка, без особого смысла.",
      en: "Just a dot with no special meaning.",
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
      en: "An idea that is not a project yet. You walk the city, spot an architectural detail on a facade, say a metope or a sandrik, take a photo, and it joins your collection. The rarer the find, the more points. From twenty pieces you can build your own facade: strictly historical, or a gothic cornice with an Art Nouveau tower.",
    },
    hr: {
      ru: "Идея: сохранить то, что исчезает из городского ландшафта, и превратить прогулку в игру. MVP: карта, камера, каталог находок, 2D-конструктор фасада. Начать с одного района и ручной классификации.",
      en: "The idea: keep what is vanishing from the cityscape and turn a walk into a game. MVP: map, camera, catalog of finds, 2D facade builder. Start with one district and manual classification.",
    },
    tech: {
      ru: "Пока мысль. React Native и Expo. Firebase на старте. TensorFlow Lite или Teachable Machine. Конструктор на react-native-svg. Админка на Retool.",
      en: "Still a thought. React Native and Expo. Firebase at the start. TensorFlow Lite or Teachable Machine. Builder on react-native-svg. Admin on Retool.",
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
      en: "Another idea, still at the note stage. You enter a cosmetic product, from a pharmacy or a store, and get a list of analogues. You can also name what must not be in the formula, and the list drops anything that contains it.",
    },
    hr: {
      ru: "Идея: подбирать аналоги косметики по составу с учётом личных ограничений. MVP: поиск средства, список аналогов по составу, фильтр для исключения нежелательного компонента.",
      en: "The idea: find analogues of a cosmetic product by formula, with personal restrictions in mind. MVP: product search, a list of analogues by formula, and a filter to exclude an unwanted ingredient.",
    },
    tech: {
      ru: "Пока мысль. Нужна база составов и сопоставление ингредиентов. Платформа и стек ещё не выбраны.",
      en: "Still a thought. It needs a database of formulas and ingredient matching. Platform and stack are not chosen yet.",
    },
  },
  {
    kind: "link",
    title: { ru: "GitHub", en: "GitHub" },
    url: "https://github.com/illiaGoncharov",
    curious: {
      ru: "Код, учебные и личные проекты. Всё, что можно показать, открыто.",
      en: "Code, study work, and personal projects. Whatever can be shown is public.",
    },
    hr: { ru: "", en: "" },
    tech: {
      ru: "Публичные репозитории. Закрытые клиентские проекты и NDA сюда не входят.",
      en: "Public repos. Client work under NDA stays out.",
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
      en: "When the conversation needs more than three messages.",
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
