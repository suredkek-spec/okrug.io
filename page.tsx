'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Accessibility,
  CalendarCheck,
  Car,
  CreditCard,
  Gift,
  MapPin,
  Menu,
  Phone,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const YCLIENTS_WIDGET_ID =
  process.env.NEXT_PUBLIC_YCLIENTS_WIDGET_ID?.trim() ?? '';
const YANDEX_METRIKA_ID =
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim() ?? '';
const BOOKING_URL =
  'https://yandex.ru/maps/org/okrug/239754011887/?booking%5Bpage%5D=menu&booking%5Bpermalink%5D=239754011887';
const MAPS_URL = 'https://yandex.ru/maps/org/okrug/239754011887/';

const navItems = [
  ['Услуги', '#services'],
  ['Мастера', '#team'],
  ['Работы', '#works'],
  ['О нас', '#about'],
  ['Отзывы', '#reviews'],
  ['Контакты', '#contacts'],
];

const serviceCards = [
  {
    title: 'Стрижки',
    price: 'от 300 ₽',
    image: '/images/work-fade.webp',
    tab: 'barber',
  },
  {
    title: 'Борода',
    price: 'от 300 ₽',
    image: '/images/work-detail.webp',
    tab: 'barber',
  },
  {
    title: 'Бритьё',
    price: 'от 600 ₽',
    image: '/images/work-scissors.webp',
    tab: 'barber',
  },
  {
    title: 'Уход',
    price: 'от 500 ₽',
    image: '/images/care-wash.webp',
    tab: 'care',
  },
  {
    title: 'Тонирование',
    price: 'от 600 ₽',
    image: '/images/work-styling.webp',
    tab: 'tone',
  },
  {
    title: 'Комплексы',
    price: 'от 1 300 ₽',
    image: '/images/interior-work.webp',
    tab: 'complex',
  },
];

type PriceItem = {
  name: string;
  price: string;
  description?: string;
  popular?: boolean;
};
type PriceGroup = {
  value: string;
  label: string;
  heading: string;
  items: PriceItem[];
};
type YandexMetrikaFunction = ((...args: unknown[]) => void) & {
  a?: unknown[][];
  l?: number;
};
type YandexMetrikaWindow = Window & {
  ym?: YandexMetrikaFunction;
  __okrugMetrikaId?: number;
};

const priceGroups: PriceGroup[] = [
  {
    value: 'barber',
    label: 'Барбер',
    heading: 'Стрижки и бритьё · Барбер',
    items: [
      {
        name: 'Стрижка мужская',
        price: '800 ₽',
        description: 'Мытьё головы до и после, укладка.',
        popular: true,
      },
      { name: 'Удлинённая стрижка (только ножницы)', price: '1 000 ₽' },
      { name: 'Стрижка машинкой (1 насадка)', price: '600 ₽' },
      { name: 'Стрижка детская (5–10 лет)', price: '700 ₽' },
      { name: 'Оформление бороды', price: '600 ₽' },
      { name: 'Классическое бритьё', price: '600 ₽' },
      { name: 'Бритьё головы', price: '800 ₽' },
    ],
  },
  {
    value: 'senior',
    label: 'Старший барбер',
    heading: 'Стрижки и бритьё · Старший барбер',
    items: [
      {
        name: 'Стрижка мужская',
        price: '1 100 ₽',
        description: 'Мытьё головы до и после, укладка.',
        popular: true,
      },
      { name: 'Удлинённая стрижка (только ножницы)', price: '1 300 ₽' },
      { name: 'Стрижка машинкой (1 насадка)', price: '700 ₽' },
      { name: 'Стрижка детская (5–10 лет)', price: '900 ₽' },
      { name: 'Оформление бороды', price: '700 ₽' },
      { name: 'Классическое бритьё', price: '700 ₽' },
      { name: 'Бритьё головы', price: '1 100 ₽' },
    ],
  },
  {
    value: 'junior',
    label: 'Младший барбер',
    heading: 'Стрижки и бритьё · Младший барбер',
    items: [
      { name: 'Стрижка мужская', price: '500 ₽', popular: true },
      { name: 'Удлинённая стрижка (только ножницы)', price: '500 ₽' },
      { name: 'Стрижка машинкой (1 насадка)', price: '300 ₽' },
      { name: 'Стрижка детская (5–10 лет)', price: '500 ₽' },
      { name: 'Оформление бороды', price: '300 ₽' },
    ],
  },
  {
    value: 'care',
    label: 'Уход и дополнительно',
    heading: 'Уход и дополнительные услуги',
    items: [
      {
        name: 'Уход за лицом (деликатное очищение кожи лица)',
        price: '800 ₽',
        popular: true,
      },
      { name: 'Уход за кожей головы и волосами', price: '500 ₽' },
      { name: 'Горячий воск (комплекс)', price: '300 ₽' },
    ],
  },
  {
    value: 'tone',
    label: 'Тонирование',
    heading: 'Тонирование (камуфляж) головы и бороды',
    items: [
      { name: 'Тонирование бороды у Барбера', price: '600 ₽' },
      { name: 'Тонирование бороды у Старшего Барбера', price: '700 ₽' },
      { name: 'Тонирование головы у Барбера', price: '800 ₽', popular: true },
      { name: 'Тонирование головы у Старшего Барбера', price: '1 000 ₽' },
    ],
  },
  {
    value: 'complex',
    label: 'Комплексы',
    heading: 'Комплексные услуги',
    items: [
      {
        name: 'Стрижка мужская + оформление бороды · Барбер',
        price: '1 400 ₽',
        popular: true,
      },
      { name: 'Стрижка + борода + горячий воск · Барбер', price: '1 700 ₽' },
      {
        name: 'Стрижка + уход за кожей головы и волосами · Барбер',
        price: '1 300 ₽',
      },
      {
        name: 'Стрижка мужская + оформление бороды · Старший барбер',
        price: '1 800 ₽',
      },
      {
        name: 'Стрижка + борода + горячий воск · Старший барбер',
        price: '2 100 ₽',
      },
      {
        name: 'Стрижка + уход за кожей головы · Старший барбер',
        price: '1 600 ₽',
      },
    ],
  },
];

const team = [
  { name: 'Софья', note: 'Специалист для записи' },
  { name: 'Мари', note: 'Специалист для записи' },
  { name: 'Анастасия', note: 'Специалист для записи' },
];

const works = [
  { src: '/images/work-fade.webp', label: 'Мужская стрижка' },
  { src: '/images/work-styling.webp', label: 'Стрижка и укладка' },
  { src: '/images/work-machine.webp', label: 'Стрижка машинкой' },
  { src: '/images/work-detail.webp', label: 'Детали стрижки' },
];

const reviews = [
  {
    name: 'Алиса Недорезова',
    text: '«Одно из лучших мест! Мария — мастер своего дела».',
  },
  {
    name: 'Андрей С.',
    text: '«Мастер подобрала хороший вариант причёски. Буду приходить снова».',
  },
  {
    name: 'Редакция Soul-Made',
    text: '«Причёска сильно изменила меня внешне — сразу понравилось».',
  },
];

function BookingLink({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={`ms_booking ${className}`}
      href={BOOKING_URL}
      target="_blank"
      rel="noreferrer"
      data-url={BOOKING_URL}
      data-yclients-widget-id={YCLIENTS_WIDGET_ID}
    >
      {children}
    </a>
  );
}

function SectionHeading({
  number,
  eyebrow,
  children,
}: {
  number: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-heading reveal">
      <span>{number}</span>
      <p>{eyebrow}</p>
      <h2>{children}</h2>
    </div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) =>
            entry.isIntersecting && entry.target.classList.add('is-visible'),
        ),
      { threshold: 0.1 },
    );
    document
      .querySelectorAll('.reveal')
      .forEach((element) => observer.observe(element));

    if (YCLIENTS_WIDGET_ID) {
      const script = document.createElement('script');
      script.src = `//w${YCLIENTS_WIDGET_ID}.yclients.com/widgetJS`;
      script.dataset.ocrugYclients = 'true';
      document.body.appendChild(script);
    }

    if (/^\d+$/.test(YANDEX_METRIKA_ID)) {
      const counterId = Number(YANDEX_METRIKA_ID);
      const metrikaWindow = window as YandexMetrikaWindow;

      if (metrikaWindow.__okrugMetrikaId !== counterId) {
        if (!metrikaWindow.ym) {
          const queue: unknown[][] = [];
          const ym = ((...args: unknown[]) =>
            queue.push(args)) as YandexMetrikaFunction;
          ym.a = queue;
          ym.l = Date.now();
          metrikaWindow.ym = ym;
        }

        if (!document.querySelector('script[data-okrug-metrika]')) {
          const script = document.createElement('script');
          script.async = true;
          script.src = 'https://mc.yandex.ru/metrika/tag.js';
          script.dataset.okrugMetrika = 'true';
          document.head.appendChild(script);
        }

        metrikaWindow.ym(counterId, 'init', {
          id: counterId,
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
        });
        metrikaWindow.__okrugMetrikaId = counterId;
      }
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['HairSalon', 'BeautySalon'],
    name: 'ОКРУГ',
    image: '/images/exterior.webp',
    telephone: '+7-4012-59-07-59',
    priceRange: '300–2100 RUB',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Черняховского, 20',
      addressLocality: 'Калининград',
      postalCode: '236040',
      addressCountry: 'RU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 54.719342,
      longitude: 20.506786,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '21:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      ratingCount: '52',
    },
    sameAs: ['https://vk.ru/okrug.barbershop'],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      {/^\d+$/.test(YANDEX_METRIKA_ID) && (
        <noscript>
          <div>
            {/* oxlint-disable-next-line next/no-img-element -- required by Yandex Metrica for visitors without JavaScript */}
            <img
              src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
              style={{ position: 'absolute', left: -9999 }}
              width="1"
              height="1"
              alt=""
            />
          </div>
        </noscript>
      )}

      <header className="site-header" data-scrolled={scrolled}>
        <a className="wordmark" href="#top" aria-label="ОКРУГ — на главную">
          ОКРУГ<span>.</span>
        </a>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {navItems.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <BookingLink className="booking-button">
          Записаться <ArrowUpRight />
        </BookingLink>
        <Sheet>
          <SheetTrigger
            render={
              <Button
                className="menu-button"
                variant="ghost"
                size="icon"
                aria-label="Открыть меню"
              />
            }
          >
            <Menu />
          </SheetTrigger>
          <SheetContent className="mobile-menu" showCloseButton>
            <SheetTitle>ОКРУГ.</SheetTitle>
            <SheetDescription>Твоё место рядом.</SheetDescription>
            <nav aria-label="Мобильная навигация">
              {navItems.map(([label, href], index) => (
                <SheetClose
                  key={href}
                  render={<a href={href} aria-label={label} />}
                >
                  <span>0{index + 1}</span>
                  {label}
                </SheetClose>
              ))}
            </nav>
            <BookingLink className="menu-booking">
              Записаться онлайн <ArrowUpRight />
            </BookingLink>
          </SheetContent>
        </Sheet>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Барбершоп · Парикмахерская · Салон красоты</p>
          <h1>ОКРУГ</h1>
          <div className="hero-message">
            <p>Твоё место рядом.</p>
            <span>Стрижём. Ухаживаем. Делаем по-своему.</span>
          </div>
          <div className="hero-actions">
            <BookingLink className="hero-book">
              Записаться онлайн <ArrowUpRight />
            </BookingLink>
            <a className="text-link" href="#services">
              Смотреть услуги <ArrowDown />
            </a>
          </div>
          <p className="microcopy">
            Онлайн-запись · удобное время · выбор мастера
          </p>
        </div>
        <div className="hero-visual">
          <Image
            src="/images/brand-hero.webp"
            alt="Фирменный образ барбершопа ОКРУГ"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 48vw"
          />
          <div className="rating-pill">
            <Star fill="currentColor" /> 5,0 <small>52 оценки на Яндексе</small>
          </div>
        </div>
      </section>

      <div className="fact-strip">
        <p>
          <b>Калининград</b>
          <span>ул. Черняховского, 20</span>
        </p>
        <p>
          <b>Каждый день</b>
          <span>09:00–21:00</span>
        </p>
        <p>
          <b>Запись</b>
          <span>YCLIENTS · без звонков</span>
        </p>
      </div>

      <section className="section services" id="services">
        <SectionHeading number="01" eyebrow="Наши услуги">
          Что делаем
        </SectionHeading>
        <div className="service-grid reveal">
          {serviceCards.map((service) => (
            <a
              className="service-card"
              href={`#price-${service.tab}`}
              key={service.title}
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 760px) 100vw, 33vw"
              />
              <span className="service-index">
                {String(serviceCards.indexOf(service) + 1).padStart(2, '0')}
              </span>
              <div>
                <h3>{service.title}</h3>
                <p>{service.price}</p>
              </div>
              <ArrowUpRight />
            </a>
          ))}
        </div>
      </section>

      <section className="section price-section" id="price">
        <SectionHeading number="02" eyebrow="Актуальный прайс">
          Услуги и цены
        </SectionHeading>
        <p className="price-note reveal">
          Цены и названия перенесены из официальной карточки ОКРУГА.
        </p>
        <Tabs defaultValue="barber" className="price-tabs reveal">
          <TabsList
            variant="line"
            className="price-tabs-list"
            aria-label="Категории прайса"
          >
            {priceGroups.map((group) => (
              <TabsTrigger value={group.value} key={group.value}>
                {group.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {priceGroups.map((group) => (
            <TabsContent
              value={group.value}
              key={group.value}
              id={`price-${group.value}`}
            >
              <div className="price-panel">
                <h3>{group.heading}</h3>
                <div className="price-list">
                  {group.items.map((item) => (
                    <div
                      className="price-row"
                      key={`${group.value}-${item.name}`}
                    >
                      <div className="price-copy">
                        <div className="price-name">
                          {item.name} {item.popular && <span>Популярно</span>}
                        </div>
                        {item.description && <p>{item.description}</p>}
                      </div>
                      <span className="price-dots" aria-hidden="true" />
                      <strong>{item.price}</strong>
                      <BookingLink className="price-book">
                        Записаться <ArrowUpRight />
                      </BookingLink>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <section className="team-section" id="team">
        <div className="team-photo reveal">
          <Image
            src="/images/master-at-work.webp"
            alt="Мастер ОКРУГА за работой"
            fill
            sizes="(max-width: 850px) 100vw, 46vw"
          />
        </div>
        <div className="team-content">
          <SectionHeading number="03" eyebrow="Люди">
            Команда ОКРУГА
          </SectionHeading>
          <p className="team-intro reveal">
            В публичной записи сейчас доступны три специалиста. Профиль, услуги
            и свободное время — в YCLIENTS.
          </p>
          <div className="team-list reveal">
            {team.map((person, index) => (
              <div className="team-row" key={person.name}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{person.name}</h3>
                  <p>{person.note}</p>
                </div>
                <BookingLink className="team-book">
                  Выбрать время <ArrowRight />
                </BookingLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section atmosphere" id="about">
        <SectionHeading number="04" eyebrow="Атмосфера">
          Свой ОКРУГ
        </SectionHeading>
        <p className="atmosphere-lead reveal">
          Место, куда можно зайти за стрижкой
          <br />и остаться из-за атмосферы.
        </p>
        <div className="atmosphere-grid reveal">
          <figure className="atmosphere-main">
            <Image
              src="/images/interior-wide.webp"
              alt="Интерьер ОКРУГА"
              fill
              sizes="(max-width: 760px) 100vw, 65vw"
            />
            <figcaption>Рабочий зал</figcaption>
          </figure>
          <figure>
            <Image
              src="/images/tools.webp"
              alt="Инструменты мастера"
              fill
              sizes="(max-width: 760px) 50vw, 28vw"
            />
            <figcaption>Детали</figcaption>
          </figure>
          <figure>
            <Image
              src="/images/products.webp"
              alt="Профессиональная косметика"
              fill
              sizes="(max-width: 760px) 50vw, 28vw"
            />
            <figcaption>Уход</figcaption>
          </figure>
          <figure className="atmosphere-action">
            <Image
              src="/images/work-scissors.webp"
              alt="Мастер ОКРУГА за работой"
              fill
              sizes="(max-width: 760px) 100vw, 34vw"
            />
            <figcaption>За работой</figcaption>
          </figure>
        </div>
      </section>

      <section className="works-section" id="works">
        <div className="section works-heading-wrap">
          <SectionHeading number="05" eyebrow="Результат">
            Работы
          </SectionHeading>
        </div>
        <div className="works-grid reveal">
          {works.map((work, index) => (
            <figure key={work.src}>
              <Image
                src={work.src}
                alt={work.label}
                fill
                sizes="(max-width: 760px) 100vw, 25vw"
              />
              <figcaption>
                <span>0{index + 1}</span>
                {work.label}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="works-cta reveal">
          <p>Покажите мастеру, что нравится, — остальное сделаем мы.</p>
          <BookingLink className="dark-booking">
            Выбрать мастера <ArrowUpRight />
          </BookingLink>
        </div>
      </section>

      <section className="section trust-section">
        <SectionHeading number="06" eyebrow="Подтверждено">
          Всё по делу
        </SectionHeading>
        <div className="trust-grid reveal">
          <article>
            <CalendarCheck />
            <h3>Онлайн-запись</h3>
            <p>Выбор услуги, мастера и времени в YCLIENTS.</p>
          </article>
          <article>
            <CreditCard />
            <h3>Удобная оплата</h3>
            <p>Карта, наличные, QR-код и безналичная оплата.</p>
          </article>
          <article>
            <Car />
            <h3>Парковка</h3>
            <p>В карточке организации подтверждена парковка.</p>
          </article>
          <article>
            <Gift />
            <h3>Подарочный сертификат</h3>
            <p>Услуга указана в официальной карточке ОКРУГА.</p>
          </article>
          <article>
            <Accessibility />
            <h3>Доступный вход</h3>
            <p>Вход доступен на инвалидной коляске, помещение — частично.</p>
          </article>
          <article className="trust-rating">
            <Star />
            <h3>5,0 на Яндексе</h3>
            <p>52 оценки и 43 публичных отзыва.</p>
          </article>
        </div>
      </section>

      <section className="reviews-section" id="reviews">
        <div className="section">
          <SectionHeading number="07" eyebrow="Яндекс Карты">
            О нас говорят
          </SectionHeading>
          <div className="reviews-grid reveal">
            {reviews.map((review) => (
              <article key={review.name}>
                <div className="stars" aria-label="5 из 5">
                  ★★★★★
                </div>
                <blockquote>{review.text}</blockquote>
                <p>{review.name}</p>
              </article>
            ))}
          </div>
          <a
            className="all-reviews"
            href={`${MAPS_URL}reviews/`}
            target="_blank"
            rel="noreferrer"
          >
            Все 43 отзыва <ArrowUpRight />
          </a>
        </div>
      </section>

      <section className="big-cta">
        <Image
          src="/images/exterior.webp"
          alt="Вход в барбершоп ОКРУГ"
          fill
          sizes="100vw"
        />
        <div className="big-cta-overlay" />
        <div className="big-cta-content reveal">
          <p>Время для себя</p>
          <h2>
            Пора
            <br />
            обновиться?
          </h2>
          <BookingLink className="hero-book">
            Выбрать мастера и время <ArrowUpRight />
          </BookingLink>
        </div>
      </section>

      <section className="contacts-section" id="contacts">
        <div className="contact-copy">
          <SectionHeading number="08" eyebrow="Контакты">
            Мы рядом
          </SectionHeading>
          <div className="contact-details reveal">
            <div>
              <MapPin />
              <span>Адрес</span>
              <a href={MAPS_URL} target="_blank" rel="noreferrer">
                Калининград,
                <br />
                ул. Черняховского, 20
              </a>
              <small>Остановка «Центральный рынок» — 140 м</small>
            </div>
            <div>
              <Phone />
              <span>Телефон</span>
              <a href="tel:+74012590759">+7 (4012) 59-07-59</a>
              <small>Каждый день · 09:00–21:00</small>
            </div>
          </div>
          <div className="contact-actions reveal">
            <BookingLink className="contact-book">
              Записаться <ArrowUpRight />
            </BookingLink>
            <a
              className="route-link"
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
            >
              Построить маршрут <ArrowUpRight />
            </a>
          </div>
        </div>
        <div className="map-wrap">
          <iframe
            title="ОКРУГ на карте"
            src="https://yandex.ru/map-widget/v1/?ll=20.506786%2C54.719342&mode=search&oid=239754011887&ol=biz&z=16"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <a className="footer-wordmark" href="#top">
            ОКРУГ.
          </a>
          <p>
            Барбершоп · Парикмахерская
            <br />
            Салон красоты
          </p>
        </div>
        <nav aria-label="Навигация в подвале">
          {navItems.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="footer-contact">
          <a href="tel:+74012590759">+7 (4012) 59-07-59</a>
          <p>
            ул. Черняховского, 20
            <br />
            09:00–21:00 ежедневно
          </p>
          <a
            href="https://vk.ru/okrug.barbershop"
            target="_blank"
            rel="noreferrer"
          >
            VK <ArrowUpRight />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ОКРУГ</span>
          <a href="#privacy" id="privacy">
            Политика конфиденциальности
          </a>
          <a href="#consent">Согласие на обработку данных</a>
        </div>
      </footer>

      <BookingLink className="mobile-sticky-book">
        Записаться <ArrowUpRight />
      </BookingLink>
    </main>
  );
}
