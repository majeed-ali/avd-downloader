import fs from "node:fs";
import path from "node:path";

const MESSAGES_DIR = path.resolve(process.cwd(), "messages");

const translationsByLocale = {
  en: {
    nav: "Watch Online",
    metaTitle: "Watch Online – Stream & Download TeraBox & Cloud Videos",
    metaDescription: "Watch and download videos from TeraBox, 1024Tera, NephoBox, and other cloud-sharing platforms directly online in your browser. Fast, free, and no registration required.",
    hero: {
      tag: "Cloud Media Player & Downloader",
      title: "Watch Online Video Player",
      description: "Stream and download video files from TeraBox, 1024Tera, NephoBox, and supported cloud services directly in your browser without software installations or user accounts."
    },
    form: {
      placeholder: "Paste supported cloud link (e.g. terabox.com/s/1...)",
      paste: "Paste",
      clear: "Clear",
      watch: "Watch Video",
      analyzing: "Analyzing video link…",
      supportedDomains: "Supported Cloud Services"
    },
    player: {
      videoPreview: "Video Ready to Stream",
      download: "Download Video",
      copyLink: "Copy Link",
      copied: "Copied!",
      quality: "Quality",
      source: "Source",
      duration: "Duration",
      size: "File Size"
    },
    faqs: {
      list: [
        {
          question: "What is Watch Online and how does it work?",
          answer: "Watch Online is an in-browser media utility that lets you inspect, stream, and download public video files hosted on supported cloud-sharing platforms (such as TeraBox, 1024Tera, NephoBox, and Flezen) without registering or installing third-party apps."
        },
        {
          question: "Which cloud sharing domains are supported?",
          answer: "We support public share URLs from terabox.com, 1024tera.com, teraboxapp.com, nephobox.com, 4funbox.com, mirrobox.com, momerybox.com, tibibox.com, freeterabox.com, diskwala.com, and flezen.com."
        },
        {
          question: "Can I download password-protected or expired files?",
          answer: "No. AnyVideoDownloader strictly honors content owners' access controls and privacy settings. If a cloud link requires a password, has expired, or was removed by its uploader, it cannot be streamed or downloaded."
        },
        {
          question: "Do I need to create an account on AnyVideoDownloader?",
          answer: "No account, email, or registration is required on AnyVideoDownloader. You can paste your link and watch or download immediately."
        },
        {
          question: "Is video playback done directly from the browser?",
          answer: "Yes. Whenever the underlying service provides a browser-compatible public media source, the video streams directly within your browser's native HTML5 player for maximum speed and privacy."
        }
      ]
    }
  },
  de: {
    nav: "Online Ansehen",
    metaTitle: "Online Ansehen – TeraBox & Cloud-Videos Streamen und Herunterladen",
    metaDescription: "Videos von TeraBox, 1024Tera, NephoBox und weiteren Cloud-Diensten direkt im Browser ansehen und herunterladen. Schnell, kostenlos und ohne Registrierung.",
    hero: {
      tag: "Cloud Video Player & Downloader",
      title: "Online Video Player",
      description: "Streamen und laden Sie Videodateien von TeraBox, 1024Tera, NephoBox und kompatiblen Cloud-Diensten direkt im Browser herunter – ohne Softwareinstallation oder Benutzerkonten."
    },
    form: {
      placeholder: "Unterstützten Cloud-Link einfügen (z. B. terabox.com/s/1...)",
      paste: "Einfügen",
      clear: "Löschen",
      watch: "Video Ansehen",
      analyzing: "Videolink wird analysiert…",
      supportedDomains: "Unterstützte Cloud-Dienste"
    },
    player: {
      videoPreview: "Video Bereit zum Streamen",
      download: "Video Herunterladen",
      copyLink: "Link Kopieren",
      copied: "Kopiert!",
      quality: "Qualität",
      source: "Quelle",
      duration: "Dauer",
      size: "Dateigröße"
    },
    faqs: {
      list: [
        {
          question: "Was ist 'Online Ansehen' und wie funktioniert es?",
          answer: "Online Ansehen ist ein webbasiertes Tool, mit dem Sie öffentliche Videodateien von Cloud-Plattformen wie TeraBox oder NephoBox direkt im Browser abspielen und herunterladen können."
        },
        {
          question: "Welche Cloud-Sharing-Domains werden unterstützt?",
          answer: "Unterstützt werden Links von terabox.com, 1024tera.com, teraboxapp.com, nephobox.com, 4funbox.com, mirrobox.com, momerybox.com, tibibox.com, freeterabox.com, diskwala.com und flezen.com."
        },
        {
          question: "Können passwortgeschützte oder abgelaufene Dateien heruntergeladen werden?",
          answer: "Nein. Wir respektieren Zugriffsbeschränkungen. Passwortgeschützte oder gelöschte Links können nicht wiedergegeben werden."
        },
        {
          question: "Muss ich ein Konto bei AnyVideoDownloader erstellen?",
          answer: "Nein, es ist keine Registrierung oder Kontoerstellung erforderlich."
        },
        {
          question: "Erfolgt die Videowiedergabe direkt im Browser?",
          answer: "Ja, sofern die Quelldatei ein kompatibles HTML5-Format bereitstellt, wird das Video direkt im Browser abgespielt."
        }
      ]
    }
  },
  fr: {
    nav: "Regarder en ligne",
    metaTitle: "Regarder en ligne – Lecteur et Téléchargeur Vidéo TeraBox et Cloud",
    metaDescription: "Regardez et téléchargez des vidéos depuis TeraBox, 1024Tera, NephoBox et autres hébergeurs cloud directement dans votre navigateur. Rapide, gratuit et sans inscription.",
    hero: {
      tag: "Lecteur & Téléchargeur Cloud",
      title: "Lecteur Vidéo en Ligne",
      description: "Diffusez et téléchargez des vidéos depuis TeraBox, 1024Tera, NephoBox et autres services cloud directement dans votre navigateur, sans installer d'application."
    },
    form: {
      placeholder: "Collez le lien cloud pris en charge (ex. terabox.com/s/1...)",
      paste: "Coller",
      clear: "Effacer",
      watch: "Regarder la vidéo",
      analyzing: "Analyse du lien vidéo…",
      supportedDomains: "Hébergeurs cloud pris en charge"
    },
    player: {
      videoPreview: "Vidéo prête à diffuser",
      download: "Télécharger la vidéo",
      copyLink: "Copier le lien",
      copied: "Copié !",
      quality: "Qualité",
      source: "Source",
      duration: "Durée",
      size: "Taille du fichier"
    },
    faqs: {
      list: [
        {
          question: "Qu'est-ce que Regarder en ligne et comment cela fonctionne-t-il ?",
          answer: "Regarder en ligne permet d'analyser, de lire et de télécharger des vidéos publiques hébergées sur TeraBox, 1024Tera, NephoBox et d'autres plateformes cloud sans créer de compte."
        },
        {
          question: "Quels domaines de partage cloud sont pris en charge ?",
          answer: "Sont pris en charge : terabox.com, 1024tera.com, teraboxapp.com, nephobox.com, 4funbox.com, mirrobox.com, momerybox.com, tibibox.com, freeterabox.com, diskwala.com et flezen.com."
        },
        {
          question: "Puis-je télécharger des fichiers protégés par mot de passe ou expirés ?",
          answer: "Non, nous respectons strictement les contrôles d'accès des créateurs. Les fichiers protégés ou expirés ne peuvent pas être lus."
        },
        {
          question: "Dois-je créer un compte sur AnyVideoDownloader ?",
          answer: "Aucune inscription ni compte n'est requis sur notre site."
        },
        {
          question: "La lecture vidéo se fait-elle directement dans le navigateur ?",
          answer: "Oui, la vidéo est diffusée directement dans le lecteur HTML5 natif de votre navigateur."
        }
      ]
    }
  },
  es: {
    nav: "Ver en línea",
    metaTitle: "Ver en línea – Reproductor y Descargador de Vídeos TeraBox y Cloud",
    metaDescription: "Mira y descarga vídeos de TeraBox, 1024Tera, NephoBox y otras plataformas cloud directamente en tu navegador. Rápido, gratis y sin registro.",
    hero: {
      tag: "Reproductor y Descargador Cloud",
      title: "Reproductor de Vídeo en Línea",
      description: "Transmite y descarga archivos de vídeo de TeraBox, 1024Tera, NephoBox y servicios cloud compatibles directamente en tu navegador sin instalar programas."
    },
    form: {
      placeholder: "Pega el enlace cloud admitido (ej. terabox.com/s/1...)",
      paste: "Pegar",
      clear: "Borrar",
      watch: "Ver Vídeo",
      analyzing: "Analizando enlace de vídeo…",
      supportedDomains: "Servicios Cloud Compatibles"
    },
    player: {
      videoPreview: "Vídeo listo para reproducir",
      download: "Descargar Vídeo",
      copyLink: "Copiar Enlace",
      copied: "¡Copiado!",
      quality: "Calidad",
      source: "Fuente",
      duration: "Duración",
      size: "Tamaño"
    },
    faqs: {
      list: [
        {
          question: "¿Qué es Ver en línea y cómo funciona?",
          answer: "Ver en línea es una herramienta web para reproducir y descargar vídeos públicos alojados en TeraBox, 1024Tera, NephoBox y otros servicios sin registrarte."
        },
        {
          question: "¿Qué dominios son compatibles?",
          answer: "Admitimos terabox.com, 1024tera.com, teraboxapp.com, nephobox.com, 4funbox.com, mirrobox.com, momerybox.com, tibibox.com, freeterabox.com, diskwala.com y flezen.com."
        },
        {
          question: "¿Puedo ver archivos protegidos por contraseña o eliminados?",
          answer: "No. Respetamos los permisos del creador. Los archivos protegidos por clave o caducados no se pueden reproducir."
        },
        {
          question: "¿Tengo que registrarme en AnyVideoDownloader?",
          answer: "No, no se necesita registro ni cuenta para utilizar el reproductor."
        },
        {
          question: "¿La reproducción se realiza en el navegador?",
          answer: "Sí, la reproducción funciona a través del reproductor HTML5 estándar de tu navegador."
        }
      ]
    }
  },
  it: {
    nav: "Guarda Online",
    metaTitle: "Guarda Online – Player e Downloader Video TeraBox e Cloud",
    metaDescription: "Guarda e scarica video da TeraBox, 1024Tera, NephoBox e altre piattaforme cloud direttamente nel browser. Veloce, gratuito e senza registrazione.",
    hero: {
      tag: "Cloud Video Player & Downloader",
      title: "Riproduttore Video Online",
      description: "Riproduci e scarica file video da TeraBox, 1024Tera, NephoBox e servizi cloud supportati direttamente nel tuo browser senza app aggiuntive."
    },
    form: {
      placeholder: "Incolla il link cloud supportato (es. terabox.com/s/1...)",
      paste: "Incolla",
      clear: "Cancella",
      watch: "Guarda Video",
      analyzing: "Analisi del link video in corso…",
      supportedDomains: "Servizi Cloud Supportati"
    },
    player: {
      videoPreview: "Video pronto per la riproduzione",
      download: "Scarica Video",
      copyLink: "Copia Link",
      copied: "Copiato!",
      quality: "Qualità",
      source: "Origine",
      duration: "Durata",
      size: "Dimensioni"
    },
    faqs: {
      list: [
        {
          question: "Cos'è Guarda Online e come funziona?",
          answer: "Guarda Online ti consente di guardare e scaricare video pubblici da TeraBox, NephoBox e altri cloud direttamente online."
        },
        {
          question: "Quali domini cloud sono supportati?",
          answer: "Supportiamo terabox.com, 1024tera.com, nephobox.com, 4funbox.com, freeterabox.com, diskwala.com, flezen.com e affini."
        },
        {
          question: "Posso scaricare file protetti da password?",
          answer: "No, i link protetti da password o scaduti non possono essere riprodotti senza autorizzazione."
        },
        {
          question: "È richiesta la registrazione?",
          answer: "Nessun account o registrazione è richiesta su AnyVideoDownloader."
        },
        {
          question: "Il video viene riprodotto direttamente nel browser?",
          answer: "Sì, tramite il lettore nativo HTML5 del browser."
        }
      ]
    }
  },
  pt: {
    nav: "Assistir Online",
    metaTitle: "Assistir Online – Player e Baixador de Vídeos TeraBox e Cloud",
    metaDescription: "Assista e baixe vídeos do TeraBox, 1024Tera, NephoBox e outras plataformas em nuvem direto no navegador. Rápido, grátis e sem cadastro.",
    hero: {
      tag: "Player e Baixador de Vídeos Cloud",
      title: "Player de Vídeo Online",
      description: "Assista e baixe arquivos de vídeo do TeraBox, 1024Tera, NephoBox e nuvens compatíveis diretamente no seu navegador sem instalar aplicativos."
    },
    form: {
      placeholder: "Cole o link da nuvem compatível (ex.: terabox.com/s/1...)",
      paste: "Colar",
      clear: "Limpar",
      watch: "Assistir Vídeo",
      analyzing: "Analisando link de vídeo…",
      supportedDomains: "Nuvens Suportadas"
    },
    player: {
      videoPreview: "Vídeo pronto para reprodução",
      download: "Baixar Vídeo",
      copyLink: "Copiar Link",
      copied: "Copiado!",
      quality: "Qualidade",
      source: "Fonte",
      duration: "Duração",
      size: "Tamanho"
    },
    faqs: {
      list: [
        {
          question: "O que é Assistir Online e como funciona?",
          answer: "É uma ferramenta web que permite visualizar e baixar vídeos compartilhados publicamente no TeraBox, NephoBox e outras nuvens sem registro."
        },
        {
          question: "Quais domínios são suportados?",
          answer: "Suportamos terabox.com, 1024tera.com, teraboxapp.com, nephobox.com, 4funbox.com, mirrobox.com, diskwala.com e flezen.com."
        },
        {
          question: "Consigo baixar arquivos com senha ou expirados?",
          answer: "Não. Links com senha ou expirados não podem ser acessados sem as devidas permissões."
        },
        {
          question: "Preciso de conta no AnyVideoDownloader?",
          answer: "Não, o serviço é 100% gratuito e livre de cadastros."
        },
        {
          question: "A reprodução é direta no navegador?",
          answer: "Sim, usando o player HTML5 nativo do seu navegador."
        }
      ]
    }
  },
  nl: {
    nav: "Online Kijken",
    metaTitle: "Online Kijken – TeraBox & Cloud Video's Streamen en Downloaden",
    metaDescription: "Bekijk en download video's van TeraBox, 1024Tera, NephoBox en andere cloudservices direct in uw browser. Snel, gratis en zonder registratie.",
    hero: {
      tag: "Cloud Videospeler & Downloader",
      title: "Online Videospeler",
      description: "Stream en download videobestanden van TeraBox, 1024Tera, NephoBox en ondersteunde cloudplatformen direct in uw browser."
    },
    form: {
      placeholder: "Plak ondersteunde cloudlink (bijv. terabox.com/s/1...)",
      paste: "Plakken",
      clear: "Wissen",
      watch: "Video Bekijken",
      analyzing: "Videolink analyseren…",
      supportedDomains: "Ondersteunde Clouddomeinen"
    },
    player: {
      videoPreview: "Video klaar om af te spelen",
      download: "Video Downloaden",
      copyLink: "Link Kopiëren",
      copied: "Gekopieerd!",
      quality: "Kwaliteit",
      source: "Bron",
      duration: "Duur",
      size: "Bestandsgrootte"
    },
    faqs: {
      list: [
        {
          question: "Wat is Online Kijken en hoe werkt het?",
          answer: "Met Online Kijken kunt u openbare videobestanden van TeraBox en verwante clouddiensten direct in uw browser afspelen en downloaden."
        },
        {
          question: "Welke clouddomeinen worden ondersteund?",
          answer: "Ondersteund worden terabox.com, 1024tera.com, nephobox.com, 4funbox.com, freeterabox.com, diskwala.com en flezen.com."
        },
        {
          question: "Kan ik met een wachtwoord beveiligde bestanden downloaden?",
          answer: "Nee, met een wachtwoord beveiligde of verlopen bestanden kunnen niet worden geopend."
        },
        {
          question: "Moet ik een account aanmaken?",
          answer: "Nee, er is geen account of registratie vereist op AnyVideoDownloader."
        },
        {
          question: "Wordt de video direct in de browser afgespeeld?",
          answer: "Ja, via de standaard HTML5-videospeler van uw browser."
        }
      ]
    }
  },
  pl: {
    nav: "Oglądaj online",
    metaTitle: "Oglądaj online – Odtwarzacz i pobieracz wideo TeraBox i Cloud",
    metaDescription: "Oglądaj i pobieraj filmy z TeraBox, 1024Tera, NephoBox i innych chmur bezpośrednio w przeglądarce. Szybko, za darmo i bez rejestracji.",
    hero: {
      tag: "Odtwarzacz i pobieracz plików z chmury",
      title: "Internetowy Odtwarzacz Wideo",
      description: "Oglądaj i pobieraj pliki wideo z serwisów TeraBox, 1024Tera, NephoBox i innych obsługiwanych chmur bezpośrednio w przeglądarce."
    },
    form: {
      placeholder: "Wklej obsługiwany link (np. terabox.com/s/1...)",
      paste: "Wklej",
      clear: "Wyczyść",
      watch: "Oglądaj wideo",
      analyzing: "Analizowanie linku wideo…",
      supportedDomains: "Obsługiwane serwisy chmurowe"
    },
    player: {
      videoPreview: "Wideo gotowe do odtworzenia",
      download: "Pobierz wideo",
      copyLink: "Kopiuj link",
      copied: "Skopiowano!",
      quality: "Jakość",
      source: "Źródło",
      duration: "Czas trwania",
      size: "Rozmiar pliku"
    },
    faqs: {
      list: [
        {
          question: "Czym jest Oglądaj online i jak działa?",
          answer: "Oglądaj online to narzędzie umożliwiające odtwarzanie i pobieranie publicznych filmów z serwisów TeraBox i powiązanych chmur w przeglądarce."
        },
        {
          question: "Jakie domeny są obsługiwane?",
          answer: "Obsługujemy terabox.com, 1024tera.com, nephobox.com, 4funbox.com, freeterabox.com, diskwala.com, flezen.com i pokrewne."
        },
        {
          question: "Czy mogę pobierać pliki chronione hasłem lub wygasłe?",
          answer: "Nie. Przestrzegamy zabezpieczeń autorów – pliki z hasłem lub usunięte nie mogą być odtworzone."
        },
        {
          question: "Czy muszę zakładać konto na AnyVideoDownloader?",
          answer: "Nie, rejestracja nie jest wymagana."
        },
        {
          question: "Czy wideo odtwarzane jest bezpośrednio w przeglądarce?",
          answer: "Tak, przy użyciu standardowego odtwarzacza HTML5."
        }
      ]
    }
  },
  ru: {
    nav: "Смотреть онлайн",
    metaTitle: "Смотреть онлайн – Плеер и загрузчик видео TeraBox и облачных дисков",
    metaDescription: "Смотрите и скачивайте видео с TeraBox, 1024Tera, NephoBox и других облачных сервисов прямо в браузере. Быстро, бесплатно и без регистрации.",
    hero: {
      tag: "Облачный видеоплеер и загрузчик",
      title: "Онлайн Видеоплеер",
      description: "Воспроизводите и скачивайте видео с TeraBox, 1024Tera, NephoBox и совместимых облачных хранилищ прямо в браузере без установки сторонних программ."
    },
    form: {
      placeholder: "Вставьте ссылку на облачный файл (напр., terabox.com/s/1...)",
      paste: "Вставить",
      clear: "Очистить",
      watch: "Смотреть видео",
      analyzing: "Анализ видеоссылки…",
      supportedDomains: "Поддерживаемые облачные сервисы"
    },
    player: {
      videoPreview: "Видео готово к просмотру",
      download: "Скачать видео",
      copyLink: "Копировать ссылку",
      copied: "Скопировано!",
      quality: "Качество",
      source: "Источник",
      duration: "Длительность",
      size: "Размер файла"
    },
    faqs: {
      list: [
        {
          question: "Что такое «Смотреть онлайн» и как это работает?",
          answer: "Это инструмент, позволяющий открывать, воспроизводить и скачивать публичные видео с TeraBox и других облачных сервисов без регистрации."
        },
        {
          question: "Какие облачные домены поддерживаются?",
          answer: "Поддерживаются ссылки с terabox.com, 1024tera.com, teraboxapp.com, nephobox.com, 4funbox.com, mirrobox.com, diskwala.com и flezen.com."
        },
        {
          question: "Можно ли скачать файлы, защищенные паролем или удаленные?",
          answer: "Нет. Мы не обходим пароли и защиту авторов. Файлы с паролем или с истекшим сроком недоступны."
        },
        {
          question: "Нужна ли регистрация на AnyVideoDownloader?",
          answer: "Регистрация или создание аккаунта не требуются."
        },
        {
          question: "Воспроизведение происходит прямо в браузере?",
          answer: "Да, через стандартный HTML5 плеер браузера."
        }
      ]
    }
  },
  zh: {
    nav: "線上觀看",
    metaTitle: "線上觀看 – TeraBox 及雲端影片播放與下載器",
    metaDescription: "在瀏覽器中直接播放並下載 TeraBox、1024Tera、NephoBox 等雲端分享影片。高速、免費、無須註冊。",
    hero: {
      tag: "雲端影音播放與下載工具",
      title: "線上影音播放器",
      description: "直接在瀏覽器中串流播放並下載來自 TeraBox、1024Tera、NephoBox 等雲端空間的公開影片，無需安裝任何軟體或註冊帳號。"
    },
    form: {
      placeholder: "貼上支援的雲端分享連結 (例如 terabox.com/s/1...)",
      paste: "貼上",
      clear: "清除",
      watch: "觀看影片",
      analyzing: "正在分析影片連結…",
      supportedDomains: "支援的雲端網域"
    },
    player: {
      videoPreview: "影片已準備就緒",
      download: "下載影片",
      copyLink: "複製連結",
      copied: "已複製！",
      quality: "畫質",
      source: "來源",
      duration: "時長",
      size: "檔案大小"
    },
    faqs: {
      list: [
        {
          question: "什麼是「線上觀看」？它是如何運作的？",
          answer: "線上觀看是一項瀏覽器工具，能直接解析、播放並下載 TeraBox 及相容雲端空間的公開影片，無需下載客戶端或註冊帳戶。"
        },
        {
          question: "支援哪些雲端網域？",
          answer: "目前支援 terabox.com, 1024tera.com, teraboxapp.com, nephobox.com, 4funbox.com, mirrobox.com, momerybox.com, diskwala.com 和 flezen.com 等。"
        },
        {
          question: "可以下載設有密碼或已失效的檔案嗎？",
          answer: "無法。我們嚴格遵守版權與隱私存取限制，加密或失效的連結無法直接播放。"
        },
        {
          question: "需要註冊 AnyVideoDownloader 帳號嗎？",
          answer: "不需要，完全免費且無需註冊。"
        },
        {
          question: "影片可以直接在瀏覽器播放嗎？",
          answer: "可以，只要來源允許，將直接調用瀏覽器原生 HTML5 播放器。"
        }
      ]
    }
  },
  el: {
    nav: "Παρακολούθηση Online",
    metaTitle: "Παρακολούθηση Online – TeraBox & Cloud Video Player",
    metaDescription: "Παρακολουθήστε και κατεβάστε βίντεο από το TeraBox, 1024Tera, NephoBox απευθείας στο πρόγραμμα περιήγησής σας. Γρήγορα, δωρεάν και χωρίς εγγραφή.",
    hero: {
      tag: "Cloud Video Player & Downloader",
      title: "Online Video Player",
      description: "Μεταδώστε και κατεβάστε αρχεία βίντεο από το TeraBox και συμβατές υπηρεσίες cloud απευθείας στο πρόγραμμα περιήγησής σας."
    },
    form: {
      placeholder: "Επικολλήστε τον σύνδεσμο cloud (π.χ. terabox.com/s/1...)",
      paste: "Επικόλληση",
      clear: "Εκκαθάριση",
      watch: "Προβολή Βίντεο",
      analyzing: "Ανάλυση συνδέσμου…",
      supportedDomains: "Υποστηριζόμενες Υπηρεσίες Cloud"
    },
    player: {
      videoPreview: "Βίντεο έτοιμο για αναπαραγωγή",
      download: "Λήψη Βίντεο",
      copyLink: "Αντιγραφή Συνδέσμου",
      copied: "Αντιγράφηκε!",
      quality: "Ποιότητα",
      source: "Πηγή",
      duration: "Διάρκεια",
      size: "Μέγεθος Αρχείου"
    },
    faqs: {
      list: [
        {
          question: "Τι είναι το 'Παρακολούθηση Online' και πώς λειτουργεί;",
          answer: "Είναι ένα εργαλείο περιήγησης για αναπαραγωγή και λήψη δημόσιων βίντεο από το TeraBox και άλλες πλατφόρμες cloud χωρίς εγγραφή."
        },
        {
          question: "Ποιες υπηρεσίες υποστηρίζονται;",
          answer: "Υποστηρίζουμε terabox.com, 1024tera.com, nephobox.com, 4funbox.com, freeterabox.com, diskwala.com και flezen.com."
        },
        {
          question: "Μπορώ να κατεβάσω αρχεία με κωδικό πρόσβασης;",
          answer: "Όχι, οι σύνδεσμοι με κωδικό πρόσβασης ή ληγμένοι σύνδεσμοι δεν υποστηρίζονται."
        },
        {
          question: "Απαιτείται εγγραφή;",
          answer: "Όχι, δεν απαιτείται λογαριασμός ή εγγραφή."
        },
        {
          question: "Η αναπαραγωγή γίνεται απευθείας στο πρόγραμμα περιήγησης;",
          answer: "Ναι, μέσω του προγράμματος αναπαραγωγής HTML5."
        }
      ]
    }
  },
  sv: {
    nav: "Titta online",
    metaTitle: "Titta online – TeraBox & Cloud Video Spelare och Nedladdare",
    metaDescription: "Titta och ladda ner videor från TeraBox, 1024Tera, NephoBox direkt i din webbläsare. Snabbt, gratis och utan registrering.",
    hero: {
      tag: "Moln Video Spelare & Nedladdare",
      title: "Online Videospelare",
      description: "Strömma och ladda ner videofiler från TeraBox och kompatibla molntjänster direkt i din webbläsare utan appinstallationer."
    },
    form: {
      placeholder: "Klistra in molnlänk (t.ex. terabox.com/s/1...)",
      paste: "Klistra in",
      clear: "Rensa",
      watch: "Titta på video",
      analyzing: "Analyserar videolänk…",
      supportedDomains: "Molntjänster som stöds"
    },
    player: {
      videoPreview: "Videon är redo att spelas upp",
      download: "Ladda ner video",
      copyLink: "Kopiera länk",
      copied: "Kopierad!",
      quality: "Kvalitet",
      source: "Källa",
      duration: "Längd",
      size: "Filstorlek"
    },
    faqs: {
      list: [
        {
          question: "Vad är Titta online och hur fungerar det?",
          answer: "Det är ett webbverktyg för att spela upp och ladda ner offentliga videor från TeraBox och andra molnlagringsplatser direkt i webbläsaren."
        },
        {
          question: "Vilka molndomäner stöds?",
          answer: "Vi stöder terabox.com, 1024tera.com, nephobox.com, 4funbox.com, diskwala.com och flezen.com."
        },
        {
          question: "Kan jag ladda ner lösenordsskyddade filer?",
          answer: "Nej, lösenordsskyddade eller utgångna filer kan inte öppnas utan behörighet."
        },
        {
          question: "Måste jag skapa ett konto?",
          answer: "Nej, ingen registrering eller inloggning krävs."
        },
        {
          question: "Spelas videon upp direkt i webbläsaren?",
          answer: "Ja, med hjälp av webbläsarens inbyggda HTML5-videospelare."
        }
      ]
    }
  },
  da: {
    nav: "Se online",
    metaTitle: "Se online – TeraBox & Cloud Video Afspiller og Downloader",
    metaDescription: "Se og download videoer fra TeraBox, 1024Tera, NephoBox og andre cloud-tjenester direkte i browseren. Hurtigt, gratis og uden registrering.",
    hero: {
      tag: "Cloud Video Afspiller & Downloader",
      title: "Online Videoafspiller",
      description: "Stream og download videofiler fra TeraBox, 1024Tera og understøttede cloud-tjenester direkte i din browser uden software."
    },
    form: {
      placeholder: "Indsæt cloud-link (f.eks. terabox.com/s/1...)",
      paste: "Indsæt",
      clear: "Ryd",
      watch: "Se video",
      analyzing: "Analyserer videolink…",
      supportedDomains: "Understøttede cloud-tjenester"
    },
    player: {
      videoPreview: "Video klar til afspilning",
      download: "Download video",
      copyLink: "Kopiér link",
      copied: "Kopieret!",
      quality: "Kvalitet",
      source: "Kilde",
      duration: "Varighed",
      size: "Filstørrelse"
    },
    faqs: {
      list: [
        {
          question: "Hvad er Se online, og hvordan virker det?",
          answer: "Det er et webværktøj til at afspille og downloade offentlige videofiler fra TeraBox og andre cloud-tjenester direkte i din browser."
        },
        {
          question: "Hvilke cloud-domæner understøttes?",
          answer: "Vi understøtter terabox.com, 1024tera.com, nephobox.com, 4funbox.com, diskwala.com og flezen.com."
        },
        {
          question: "Kan jeg downloade adgangskodebeskyttede filer?",
          answer: "Nej, adgangskodebeskyttede eller udløbne links kan ikke tilgås."
        },
        {
          question: "Skal jeg oprette en konto?",
          answer: "Nej, ingen konto eller registrering er nødvendig."
        },
        {
          question: "Afspilles videoen direkte i browseren?",
          answer: "Ja, via den indbyggede HTML5-afspiller."
        }
      ]
    }
  },
  fi: {
    nav: "Katso verkossa",
    metaTitle: "Katso verkossa – TeraBox & Pilvivideoiden Toistin ja Lataaja",
    metaDescription: "Katso ja lataa videoita TeraBoxista, 1024Terasta, NephoBoxista suoraan selaimessasi. Nopeaa, ilmaista ja ilman rekisteröitymistä.",
    hero: {
      tag: "Pilvivideosoitin & Lataaja",
      title: "Online-Videotoistin",
      description: "Suoratoista ja lataa videotiedostoja TeraBoxista ja tuetuista pilvipalveluista suoraan selaimessasi ilman sovelluksia."
    },
    form: {
      placeholder: "Liitä pilvilinkki (esim. terabox.com/s/1...)",
      paste: "Liitä",
      clear: "Tyhjennä",
      watch: "Katso video",
      analyzing: "Analysoidaan videolinkkiä…",
      supportedDomains: "Tuetut pilvipalvelut"
    },
    player: {
      videoPreview: "Video valmis toistettavaksi",
      download: "Lataa video",
      copyLink: "Kopioi linkki",
      copied: "Kopioitu!",
      quality: "Laatu",
      source: "Lähde",
      duration: "Kesto",
      size: "Tiedostokoko"
    },
    faqs: {
      list: [
        {
          question: "Mitä Katso verkossa tarkoittaa ja miten se toimii?",
          answer: "Se on selaintyökalu julkisten videoiden toistamiseen ja lataamiseen TeraBoxista ja muista pilvipalveluista suoraan selaimessa."
        },
        {
          question: "Mitä verkkotunnuksia tuetaan?",
          answer: "Tuemme terabox.com, 1024tera.com, nephobox.com, 4funbox.com, diskwala.com ja flezen.com linkkejä."
        },
        {
          question: "Voinko ladata salasanasuojattuja tiedostoja?",
          answer: "Et, salasanasuojattuja tai vanhentuneita tiedostoja ei voi toistaa."
        },
        {
          question: "Tarvitseeko minun luoda tili?",
          answer: "Tiliä tai rekisteröitymistä ei tarvita."
        },
        {
          question: "Toistuuko video suoraan selaimessa?",
          answer: "Kyllä, suoraan selaimen natiivissa HTML5-soittimessa."
        }
      ]
    }
  },
  cs: {
    nav: "Sledovat online",
    metaTitle: "Sledovat online – Přehrávač a stahovač videí TeraBox a Cloud",
    metaDescription: "Sledujte a stahujte videa z TeraBox, 1024Tera, NephoBox přímo v prohlížeči. Rychle, zdarma a bez nutnosti registrace.",
    hero: {
      tag: "Cloudový přehrávač a stahovač",
      title: "Online Přehrávač Videa",
      description: "Přehrávejte a stahujte videosoubory z TeraBoxu, 1024Tera a dalších cloudových služeb přímo ve svém prohlížeči."
    },
    form: {
      placeholder: "Vložte podporovaný odkaz (např. terabox.com/s/1...)",
      paste: "Vložit",
      clear: "Vymazat",
      watch: "Přehrát video",
      analyzing: "Analyzuji odkaz na video…",
      supportedDomains: "Podporované cloudové služby"
    },
    player: {
      videoPreview: "Video připraveno k přehrání",
      download: "Stáhnout video",
      copyLink: "Kopírovat odkaz",
      copied: "Zkopírováno!",
      quality: "Kvalita",
      source: "Zdroj",
      duration: "Délka",
      size: "Velikost souboru"
    },
    faqs: {
      list: [
        {
          question: "Co je Sledovat online a jak funguje?",
          answer: "Je to nástroj pro přehrávání a stahování veřejných videí z TeraBoxu a dalších cloudů přímo v prohlížeči."
        },
        {
          question: "Které cloudové domény jsou podporovány?",
          answer: "Podporujeme terabox.com, 1024tera.com, nephobox.com, 4funbox.com, diskwala.com i flezen.com."
        },
        {
          question: "Lze stahovat soubory chráněné heslem?",
          answer: "Ne, soubory chráněné heslem nebo vypršené nelze přehrát."
        },
        {
          question: "Je nutná registrace?",
          answer: "Ne, na AnyVideoDownloader není nutná žádná registrace."
        },
        {
          question: "Probíhá přehrávání přímo v prohlížeči?",
          answer: "Ano, prostřednictvím přehrávače HTML5."
        }
      ]
    }
  },
  sk: {
    nav: "Sledovať online",
    metaTitle: "Sledovať online – Prehrávač a sťahovač videí TeraBox a Cloud",
    metaDescription: "Sledujte a sťahujte videá z TeraBox, 1024Tera, NephoBox priamo v prehliadači. Rýchlo, zadarmo a bez registrácie.",
    hero: {
      tag: "Cloudový prehrávač a sťahovač",
      title: "Online Prehrávač Videa",
      description: "Prehrávajte a sťahujte videosúbory z TeraBoxu, 1024Tera a podporovaných cloudových služieb priamo vo svojom prehliadači."
    },
    form: {
      placeholder: "Vložte podporovaný odkaz (napr. terabox.com/s/1...)",
      paste: "Vložiť",
      clear: "Vymazať",
      watch: "Prehrať video",
      analyzing: "Analyzujem odkaz na video…",
      supportedDomains: "Podporované cloudové služby"
    },
    player: {
      videoPreview: "Video pripravené na prehrávanie",
      download: "Stiahnuť video",
      copyLink: "Kopírovať odkaz",
      copied: "Skopírované!",
      quality: "Kvalita",
      source: "Zdroj",
      duration: "Dĺžka",
      size: "Veľkosť súboru"
    },
    faqs: {
      list: [
        {
          question: "Čo je Sledovať online a ako funguje?",
          answer: "Je to nástroj na prehrávanie a sťahovanie verejných videí z TeraBoxu a iných cloudov priamo v prehliadači."
        },
        {
          question: "Ktoré domény sú podporované?",
          answer: "Podporujeme terabox.com, 1024tera.com, nephobox.com, 4funbox.com, diskwala.com a flezen.com."
        },
        {
          question: "Môžem sťahovať súbory chránené heslom?",
          answer: "Nie, súbory chránené heslom alebo vymazané súbory nemožno prehrať."
        },
        {
          question: "Musím sa registrovať?",
          answer: "Nie, registrácia nie je potrebná."
        },
        {
          question: "Prehráva sa video priamo v prehliadači?",
          answer: "Áno, pomocou prehrávača HTML5."
        }
      ]
    }
  },
  bg: {
    nav: "Гледайте онлайн",
    metaTitle: "Гледайте онлайн – TeraBox & Cloud Видео Плейър и Инструмент за Изтегляне",
    metaDescription: "Гледайте и изтегляйте видеоклипове от TeraBox, 1024Tera, NephoBox директно в браузъра си. Бързо, безплатно и без регистрация.",
    hero: {
      tag: "Облачен видео плейър и сваляне",
      title: "Онлайн Видео Плейър",
      description: "Гледайте и изтегляйте видео файлове от TeraBox, 1024Tera, NephoBox и съвместими облачни услуги директно в браузъра си."
    },
    form: {
      placeholder: "Поставете поддържан облачен линк (напр. terabox.com/s/1...)",
      paste: "Постави",
      clear: "Изчисти",
      watch: "Гледай видео",
      analyzing: "Анализиране на видео линка…",
      supportedDomains: "Поддържани облачни услуги"
    },
    player: {
      videoPreview: "Видеото е готово за гледане",
      download: "Изтегляне на видео",
      copyLink: "Копирай линка",
      copied: "Копирано!",
      quality: "Качество",
      source: "Източник",
      duration: "Продължителност",
      size: "Размер на файла"
    },
    faqs: {
      list: [
        {
          question: "Какво е Гледайте онлайн и как работи?",
          answer: "Уеб инструмент за възпроизвеждане и изтегляне на публични видеоклипове от TeraBox и други облачни услуги директно в браузъра."
        },
        {
          question: "Кои облачни домейни се поддържат?",
          answer: "Поддържаме terabox.com, 1024tera.com, nephobox.com, 4funbox.com, diskwala.com и flezen.com."
        },
        {
          question: "Мога ли да изтеглям файлове, защитени с парола?",
          answer: "Не, файлове с парола или с изтекъл срок не могат да бъдат отворени."
        },
        {
          question: "Нужна ли е регистрация?",
          answer: "Не, не се изисква регистрация."
        },
        {
          question: "Възпроизвеждането директно в браузъра ли е?",
          answer: "Да, чрез вградения HTML5 плейър."
        }
      ]
    }
  },
  sl: {
    nav: "Glejte na spletu",
    metaTitle: "Glejte na spletu – Predvajalnik in prenosnik videoposnetkov TeraBox in Cloud",
    metaDescription: "Oglejte si in prenesite videoposnetke s platform TeraBox, 1024Tera, NephoBox neposredno v brskalniku. Hitro, brezplačno in brez registracije.",
    hero: {
      tag: "Oblačni predvajalnik in prenosnik",
      title: "Spletni Video Predvajalnik",
      description: "Predvajajte in prenašajte videoposnetke s platform TeraBox, 1024Tera in podprtih oblakov neposredno v svojem brskalniku."
    },
    form: {
      placeholder: "Prilepite povezavo (npr. terabox.com/s/1...)",
      paste: "Prilepi",
      clear: "Počisti",
      watch: "Oglej si video",
      analyzing: "Analiziranje povezave…",
      supportedDomains: "Podprte oblačne storitve"
    },
    player: {
      videoPreview: "Video pripravljen za predvajanje",
      download: "Prenesi video",
      copyLink: "Kopiraj povezavo",
      copied: "Kopirano!",
      quality: "Kakovost",
      source: "Vir",
      duration: "Trajanje",
      size: "Velikost datoteke"
    },
    faqs: {
      list: [
        {
          question: "Kaj je 'Glejte na spletu' in kako deluje?",
          answer: "To je spletno orodje za predvajanje in prenos javnih videoposnetkov iz TeraBoxa in drugih oblakov brez registracije."
        },
        {
          question: "Katere domene so podprte?",
          answer: "Podpiramo terabox.com, 1024tera.com, nephobox.com, 4funbox.com, diskwala.com in flezen.com."
        },
        {
          question: "Ali lahko prenesem datoteke, zaščitene z geslom?",
          answer: "Ne, povezav z geslom ali poteklih datotek ni mogoče predvajati."
        },
        {
          question: "Ali je potrebna registracija?",
          answer: "Ne, registracija ni potrebna."
        },
        {
          question: "Ali se video predvaja neposredno v brskalniku?",
          answer: "Da, preko brskalnikovega predvajalnika HTML5."
        }
      ]
    }
  },
  lv: {
    nav: "Skatīties tiešsaistē",
    metaTitle: "Skatīties tiešsaistē – TeraBox un Cloud Video Atskaņotājs un Lejupielādētājs",
    metaDescription: "Skatieties un lejupielādējiet video no TeraBox, 1024Tera, NephoBox tieši savā pārlūkprogrammā. Ātri, bez maksas un bez reģistrācijas.",
    hero: {
      tag: "Mākoņa video atskaņotājs un lejupielādētājs",
      title: "Tiešsaistes Video Atskaņotājs",
      description: "Straumējiet un lejupielādējiet video failus no TeraBox un atbalstītajiem mākoņpakalpojumiem tieši savā pārlūkprogrammā."
    },
    form: {
      placeholder: "Ielīmējiet saiti (piem., terabox.com/s/1...)",
      paste: "Ielīmēt",
      clear: "Notīrīt",
      watch: "Skatīties video",
      analyzing: "Analizē video saiti…",
      supportedDomains: "Atbalstītie mākoņpakalpojumi"
    },
    player: {
      videoPreview: "Video gatavs atskaņošanai",
      download: "Lejupielādēt video",
      copyLink: "Kopēt saiti",
      copied: "Nokopēts!",
      quality: "Kvalitāte",
      source: "Avots",
      duration: "Ilgums",
      size: "Faila izmērs"
    },
    faqs: {
      list: [
        {
          question: "Kas ir 'Skatīties tiešsaistē' un kā tas darbojas?",
          answer: "Tīmekļa rīks publisku video atskaņošanai un lejupielādei no TeraBox un citiem mākoņpakalpojumiem tieši pārlūkā."
        },
        {
          question: "Kuri mākoņdomēni tiek atbalstīti?",
          answer: "Tiek atbalstīti terabox.com, 1024tera.com, nephobox.com, 4funbox.com, diskwala.com un flezen.com."
        },
        {
          question: "Vai var lejupielādēt ar paroli aizsargātus failus?",
          answer: "Nē, ar paroli aizsargātus failus nav iespējams atvērt bez atļaujas."
        },
        {
          question: "Vai ir nepieciešama reģistrācija?",
          answer: "Nē, reģistrācija nav nepieciešama."
        },
        {
          question: "Vai video tiek atskaņots tieši pārlūkā?",
          answer: "Jā, izmantojot HTML5 atskaņotāju."
        }
      ]
    }
  },
  lt: {
    nav: "Žiūrėti internetu",
    metaTitle: "Žiūrėti internetu – TeraBox ir debesijos vaizdo įrašų leistuvas bei atsisiuntėjas",
    metaDescription: "Žiūrėkite ir atsisiųskite vaizdo įrašus iš TeraBox, 1024Tera, NephoBox tiesiogiai naršyklėje. Greita, nemokama ir be registracijos.",
    hero: {
      tag: "Debesijos vaizdo grotuvas ir atsisiuntėjas",
      title: "Internetinis Vaizdo Grotuvas",
      description: "Žiūrėkite ir atsisiųskite vaizdo failus iš TeraBox ir palaikomų debesijos paslaugų tiesiogiai naršyklėje be papildomų programų."
    },
    form: {
      placeholder: "Įklijuokite nuorodą (pvz., terabox.com/s/1...)",
      paste: "Įklijuoti",
      clear: "Išvalyti",
      watch: "Žiūrėti vaizdo įrašą",
      analyzing: "Analizuojama vaizdo nuoroda…",
      supportedDomains: "Palaikomos debesijos paslaugos"
    },
    player: {
      videoPreview: "Vaizdo įrašas paruoštas žiūrėjimui",
      download: "Atsisiųsti vaizdo įrašą",
      copyLink: "Kopijuoti nuorodą",
      copied: "Nukopijuota!",
      quality: "Kokybė",
      source: "Šaltinis",
      duration: "Trukmė",
      size: "Failo dydis"
    },
    faqs: {
      list: [
        {
          question: "Kas yra 'Žiūrėti internetu' ir kaip tai veikia?",
          answer: "Tai internetinis įrankis, leidžiantis žiūrėti ir atsisiųsti viešus vaizdo įrašus iš TeraBox ir kitų debesų saugyklų."
        },
        {
          question: "Kokie domenai palaikomi?",
          answer: "Palaikomi terabox.com, 1024tera.com, nephobox.com, 4funbox.com, diskwala.com ir flezen.com."
        },
        {
          question: "Ar galima atsisiųsti slaptažodžiu apsaugotus failus?",
          answer: "Ne, slaptažodžiu apsaugoti arba pasibaigusio galiojimo failai negali būti atverti."
        },
        {
          question: "Ar reikia susikurti paskyrą?",
          answer: "Ne, jokia registracija nėra reikalinga."
        },
        {
          question: "Ar vaizdo įrašas leidžiamas naršyklėje?",
          answer: "Taip, naudojant HTML5 leistuvą."
        }
      ]
    }
  }
};

const locales = [
  "en", "de", "pl", "fr", "es", "el", "lv", "lt", "nl", "zh",
  "it", "sv", "sk", "pt", "sl", "ru", "da", "fi", "bg", "cs"
];

for (const loc of locales) {
  const filePath = path.join(MESSAGES_DIR, `${loc}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`File ${filePath} does not exist, skipping.`);
    continue;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  const locTranslation = translationsByLocale[loc] || translationsByLocale["en"];
  data.watchOnline = locTranslation;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
  console.log(`Updated messages/${loc}.json with watchOnline section.`);
}

console.log("All 20 translation files successfully updated!");
