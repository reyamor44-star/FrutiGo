export type Language = "es" | "en" | "pt";

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "es", name: "Español", flag: "🇲🇽" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
];

export const UI_TRANSLATIONS: Record<Language, {
  headerSubtitle: string;
  adminTooltip: string;
  officialDocTag: string;
  lastUpdated: string;
  cookieMessage: string;
  acceptCookies: string;
  selectLanguageTitle: string;
  statusLabel: string;
  shareSection: string;
  linkCopied: string;
  downloadOnGooglePlay: string;
  sections: {
    politicas: string;
    terminos: string;
    privacidad: string;
    desarrollador: string;
    medios: string;
    nosotros: string;
    soporte: string;
    cuenta: string;
    articulos: string;
  };
  deletionForm: {
    title: string;
    subtitle: string;
    warning: string;
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    reason: string;
    selectReason: string;
    reasons: {
      noUse: string;
      privacy: string;
      technical: string;
      moved: string;
      other: string;
    };
    commentsLabel: string;
    commentsPlaceholder: string;
    confirmCheckbox: string;
    submitButton: string;
    submitting: string;
    contactTitle: string;
    contactDesc: string;
    emailLabel: string;
    phoneLabel: string;
    hours: string;
    successTitle: string;
    successDesc: string;
    successAlert: string;
    successContact: string;
  };
}> = {
  es: {
    headerSubtitle: "Cumplimiento Normativo",
    adminTooltip: "Panel de Administración",
    officialDocTag: "Documento Legal Oficial",
    lastUpdated: "Última actualización: Septiembre de 2026",
    cookieMessage: "Utilizamos cookies para garantizar la mejor experiencia legal y de navegación en Fruti Go.",
    acceptCookies: "Aceptar y Continuar",
    selectLanguageTitle: "Selecciona tu idioma",
    statusLabel: "ESTADO: VIGENTE / CERTIFICADO",
    shareSection: "Compartir",
    linkCopied: "¡Enlace Copiado!",
    downloadOnGooglePlay: "Disponible en Google Play",
    sections: {
      politicas: "Políticas",
      terminos: "Términos y Condiciones",
      privacidad: "Privacidad",
      desarrollador: "Acerca de Nosotros / Infraestructura Tecnológica",
      medios: "Medios y Sala de Prensa",
      nosotros: "Acerca de Nosotros / Infraestructura Tecnológica",
      soporte: "Soporte",
      cuenta: "Eliminar Cuenta",
      articulos: "Artículos y Blog",
    },
    deletionForm: {
      title: "Eliminación de Cuenta y Datos",
      subtitle: "Solicita de forma segura la baja de tu cuenta y la depuración completa de tus datos de Fruti Go.",
      warning: "Al enviar esta solicitud, tu cuenta y todos los datos asociados en Fruti Go serán eliminados de nuestros servidores en un plazo máximo de 72 horas.",
      fullName: "Nombre Completo *",
      fullNamePlaceholder: "Tu nombre completo",
      email: "Correo Electrónico *",
      emailPlaceholder: "ejemplo@correo.com",
      phone: "Número de Teléfono *",
      phonePlaceholder: "10 dígitos de tu cuenta",
      reason: "Motivo de Eliminación",
      selectReason: "Selecciona una opción...",
      reasons: {
        noUse: "Ya no utilizo la aplicación",
        privacy: "Preocupaciones de privacidad",
        technical: "Problemas recurrentes en el funcionamiento",
        moved: "Ya no resido en la zona de servicio",
        other: "Otro motivo",
      },
      commentsLabel: "¿Por qué eliminas tu cuenta? y Comentarios para mejora *",
      commentsPlaceholder: "Por favor, explica detalladamente el motivo de tu baja y cuéntanos qué comentarios o sugerencias tienes para la mejora de Fruti Go...",
      confirmCheckbox: "Confirmo que deseo solicitar la eliminación total de mi cuenta de Fruti Go y todos mis datos personales asociados de forma permanente de sus servidores, comprendiendo que esta acción es irreversible.",
      submitButton: "Enviar Solicitud de Eliminación",
      submitting: "Procesando Solicitud...",
      contactTitle: "Contacto de Fruti Go",
      contactDesc: "Si lo prefieres, también puedes contactar directamente a nuestro departamento de soporte para consultas relacionadas con tus derechos ARCO o asistencia técnica rápida.",
      emailLabel: "Correo Electrónico",
      phoneLabel: "Teléfono Directo",
      hours: "Horario de atención:\nLunes a Viernes • 09:00 a 18:00 hrs.",
      successTitle: "Solicitud Recibida",
      successDesc: "Tu solicitud de eliminación ha sido registrada con éxito.",
      successAlert: "\"Al enviar esta solicitud, tu cuenta y todos los datos asociados en Fruti Go serán eliminados de nuestros servidores en un plazo máximo de 72 horas.\"",
      successContact: "Si tienes alguna duda adicional, contáctanos a",
    },
  },
  en: {
    headerSubtitle: "Regulatory Compliance",
    adminTooltip: "Admin Panel",
    officialDocTag: "Official Legal Document",
    lastUpdated: "Last updated: September 2026",
    cookieMessage: "We use cookies to ensure the best legal and browsing experience on Fruti Go.",
    acceptCookies: "Accept & Continue",
    selectLanguageTitle: "Select your language",
    statusLabel: "STATUS: ACTIVE / CERTIFIED",
    shareSection: "Share",
    linkCopied: "Link Copied!",
    downloadOnGooglePlay: "Get it on Google Play",
    sections: {
      politicas: "Policies",
      terminos: "Terms & Conditions",
      privacidad: "Privacy Notice",
      desarrollador: "About Us / Technological Infrastructure",
      medios: "Media & Press Room",
      nosotros: "About Us / Technological Infrastructure",
      soporte: "Support",
      cuenta: "Delete Account",
      articulos: "Articles & Blog",
    },
    deletionForm: {
      title: "Account and Data Deletion",
      subtitle: "Securely request the closure of your account and full deletion of your data from Fruti Go.",
      warning: "By submitting this request, your account and all associated data on Fruti Go will be permanently deleted from our servers within a maximum of 72 hours.",
      fullName: "Full Name *",
      fullNamePlaceholder: "Your full name",
      email: "Email Address *",
      emailPlaceholder: "example@email.com",
      phone: "Phone Number *",
      phonePlaceholder: "10 digits associated with account",
      reason: "Reason for Deletion",
      selectReason: "Select an option...",
      reasons: {
        noUse: "I no longer use the application",
        privacy: "Privacy concerns",
        technical: "Recurring technical issues",
        moved: "I no longer live in the service area",
        other: "Other reason",
      },
      commentsLabel: "Why are you deleting your account? Feedback for improvement *",
      commentsPlaceholder: "Please explain in detail your reason for leaving and share any feedback or suggestions to help us improve Fruti Go...",
      confirmCheckbox: "I confirm that I want to request the total and permanent deletion of my Fruti Go account and all associated personal data from its servers, understanding that this action is irreversible.",
      submitButton: "Submit Deletion Request",
      submitting: "Processing Request...",
      contactTitle: "Fruti Go Contact",
      contactDesc: "If preferred, you can also directly contact our support department for inquiries related to your privacy rights or quick technical assistance.",
      emailLabel: "Email Address",
      phoneLabel: "Direct Phone",
      hours: "Business hours:\nMonday to Friday • 09:00 to 18:00 hrs.",
      successTitle: "Request Received",
      successDesc: "Your deletion request has been successfully recorded.",
      successAlert: "\"By submitting this request, your account and all associated data on Fruti Go will be deleted from our servers within a maximum of 72 hours.\"",
      successContact: "If you have any further questions, contact us at",
    },
  },
  pt: {
    headerSubtitle: "Conformidade Regulatória",
    adminTooltip: "Painel de Administração",
    officialDocTag: "Documento Legal Oficial",
    lastUpdated: "Última atualização: Setembro de 2026",
    cookieMessage: "Utilizamos cookies para garantir a melhor experiência legal e de navegação no Fruti Go.",
    acceptCookies: "Aceitar e Continuar",
    selectLanguageTitle: "Selecione o seu idioma",
    statusLabel: "STATUS: VIGENTE / CERTIFICADO",
    shareSection: "Compartilhar",
    linkCopied: "Link Copiado!",
    downloadOnGooglePlay: "Disponível no Google Play",
    sections: {
      politicas: "Políticas",
      terminos: "Termos e Condições",
      privacidad: "Privacidade",
      desarrollador: "Sobre Nós / Infraestrutura Tecnológica",
      medios: "Mídia e Sala de Imprensa",
      nosotros: "Sobre Nós / Infraestrutura Tecnológica",
      soporte: "Suporte",
      cuenta: "Excluir Conta",
      articulos: "Artigos e Blog",
    },
    deletionForm: {
      title: "Exclusão de Conta e Dados",
      subtitle: "Solicite com segurança o encerramento da sua conta e a exclusão completa dos seus dados no Fruti Go.",
      warning: "Ao enviar esta solicitação, sua conta e todos os dados associados no Fruti Go serão excluídos permanentemente de nossos servidores no prazo máximo de 72 horas.",
      fullName: "Nome Completo *",
      fullNamePlaceholder: "Seu nome completo",
      email: "E-mail *",
      emailPlaceholder: "exemplo@email.com",
      phone: "Número de Telefone *",
      phonePlaceholder: "10 dígitos da sua conta",
      reason: "Motivo da Exclusão",
      selectReason: "Selecione uma opção...",
      reasons: {
        noUse: "Não utilizo mais o aplicativo",
        privacy: "Preocupações com privacidade",
        technical: "Problemas técnicos recorrentes",
        moved: "Não resido mais na área de atendimento",
        other: "Outro motivo",
      },
      commentsLabel: "Por que você está excluindo sua conta? Comentários para melhoria *",
      commentsPlaceholder: "Por favor, explique em detalhes o motivo do seu cancelamento e compartilhe sugestões para a melhoria do Fruti Go...",
      confirmCheckbox: "Confirmo que desejo solicitar a exclusão total da minha conta Fruti Go e de todos os meus dados pessoais associados permanentemente de seus servidores, compreendendo que esta ação é irreversível.",
      submitButton: "Enviar Solicitação de Exclusão",
      submitting: "Processando Solicitação...",
      contactTitle: "Contato Fruti Go",
      contactDesc: "Se preferir, você também pode entrar em contato diretamente com o nosso departamento de suporte para dúvidas relacionadas aos seus direitos de privacidade ou assistência técnica rápida.",
      emailLabel: "E-mail",
      phoneLabel: "Telefone Direto",
      hours: "Horário de atendimento:\nSegunda a Sexta • 09:00 às 18:00 hrs.",
      successTitle: "Solicitação Recebida",
      successDesc: "Sua solicitação de exclusão foi registrada com sucesso.",
      successAlert: "\"Ao enviar esta solicitação, sua conta e todos os dados associados no Fruti Go serão excluídos de nossos servidores em no máximo 72 horas.\"",
      successContact: "Se você tiver alguma dúvida adicional, entre em contato em",
    },
  },
};

export const DEFAULT_POLICIES_BY_LANG: Record<Language, {
  politicas: string;
  terminos: string;
  privacidad: string;
  nosotros: string;
  soporte: string;
}> = {
  es: {
    politicas: `
      <h1>Políticas de Operación, Logística y Calidad | FrutiGo Technologies & Logistics</h1>
      <p>En <b>FrutiGo Logistics</b> y <b>FrutiGo Technologies</b>, bajo la supervisión de nuestra <b>Dirección de Arquitectura e Infraestructura Tecnológica</b>, nuestra infraestructura tecnológica y operativa está diseñada para garantizar la máxima eficiencia en la cadena de distribución, conectando productores directos con hogares y empresas.</p>
      
      <h2>1. Estándares de Calidad y Cadena de Suministro</h2>
      <p>Implementamos rigurosos protocolos de selección y trazabilidad en cada etapa logística. Si algún lote o producto no cumple con nuestros estándares de inocuidad y frescura al momento de la entrega, nuestros clientes cuentan con la <b>Garantía de Calidad Institucional de FrutiGo</b>, respaldada por nuestro Equipo de Ingeniería para un reemplazo o ajuste inmediato.</p>
      
      <h2>2. Infraestructura Transaccional Segura con Openpay by BBVA</h2>
      <p>La seguridad en las transacciones digitales es un pilar central de nuestra arquitectura de pagos. Todos los cobros con tarjeta bancaria y transferencias electrónicas se procesan a través de la pasarela certificada <b>Openpay by BBVA</b>, bajo estándares internacionales de encriptación bancaria PCI-DSS Nivel 1. FrutiGo Technologies no almacena números de tarjeta ni datos financieros sensibles en sus servidores de aplicación.</p>
      
      <h2>3. Red Logística y Cobertura de Distribución</h2>
      <p>Operamos mediante modelos de optimización de rutas y geocercas inteligentes en la Zona Metropolitana de Guadalajara y corredores logísticos estratégicos, asegurando entregas puntuales y monitoreo en tiempo real.</p>
      
      <h2>4. Gestión de Cancelaciones y Modificaciones</h2>
      <p>Para preservar la eficiencia de nuestra red de despacho y la naturaleza perecedera de las mercancías, las cancelaciones o reprogramaciones de pedidos deben realizarse con un mínimo de 2 horas de anticipación a la ventana operativa asignada.</p>

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
        <p style="font-size: 13px; color: #52525b; margin: 0;"><strong>Dirección de Arquitectura y Sistemas:</strong></p>
        <p style="font-size: 14px; font-weight: bold; color: #0D7A3F; margin: 2px 0 0 0;">FrutiGo Technologies — Dirección de Arquitectura e Infraestructura</p>
        <p style="font-size: 12px; color: #71717a; margin: 0;">FrutiGo Technologies & FrutiGo Logistics</p>
      </div>
    `,
    terminos: `
      <h1>Términos y Condiciones de Uso y Servicios</h1>
      <p class="text-xs text-zinc-400 -mt-2 mb-6">Última actualización: Septiembre de 2026</p>
      
      <p>Bienvenido a <b>FrutiGo Technologies</b> y <b>FrutiGo Logistics</b>, representadas legalmente por su <b>Fundador y CEO, Alberto Reyes Sandoval</b>. Los presentes Términos y Condiciones regulan el acceso, registro y uso de nuestras plataformas tecnológicas, aplicaciones móviles, interfaces API, servicios de movilidad urbana y soluciones logísticas (en adelante, "la Plataforma"). Nuestra infraestructura es propiedad de <b>FrutiGo Technologies</b> y operada por <b>FrutiGo Logistics</b>, con domicilio operativo en <b>San Rafael 2790, Col. El Campanario, CP 45234, Guadalajara, Jalisco, México</b>, correo de contacto <b>frutigo33@gmail.com</b> y teléfono <b>3317093598</b>. El uso de nuestros servicios implica la aceptación vinculante e irrestricta de estos términos.</p>
      
      <h2>1. Uso de la Plataforma e Infraestructura Digital</h2>
      <ul>
        <li><b>Requisitos de Acceso:</b> El usuario debe contar con al menos 18 años de edad y plena capacidad jurídica para contratar según la legislación aplicable en los Estados Unidos Mexicanos.</li>
        <li><b>Licencia de Uso:</b> Se otorga una licencia de software limitada, no transferible, no exclusiva y revocable para utilizar nuestras aplicaciones con fines personales, comerciales, logísticos y de movilidad privada autorizados.</li>
        <li><b>Restricciones Operativas:</b> Queda prohibido vulnerar, descompilar, realizar ingeniería inversa, extraer datos de forma no autorizada o utilizar la plataforma para actividades fraudulentas o ilícitas.</li>
      </ul>
      
      <h2>2. Cuentas Corporativas e Individuales</h2>
      <p>El usuario o entidad registrada es responsable exclusivo de la custodia de sus credenciales y de la veracidad de los datos suministrados. FrutiGo Technologies implementa protocolos de autenticación robustos y cifrado de extremo a extremo para salvaguardar la integridad de cada cuenta.</p>
      
      <h2>3. Propiedad Intelectual y Arquitectura Tecnológica</h2>
      <p>La totalidad de las marcas registradas, logotipos, arquitecturas de software, modelos de datos, algoritmos de enrutamiento y contenidos pertenecen de forma exclusiva a <b>FrutiGo Technologies</b> bajo la titularidad de su Fundador y CEO <b>Alberto Reyes Sandoval</b>. Toda reproducción, distribución o ingeniería no autorizada queda estrictamente prohibida bajo la legislación de propiedad industrial y derechos de autor.</p>
      
      <h2>4. Nivel de Servicio y Limitación de Responsabilidad</h2>
      <p>FrutiGo Technologies despliega infraestructura en la nube con altos índices de disponibilidad (uptime). Los servicios se suministran "tal cual" y "según disponibilidad" bajo estándares profesionales de disponibilidad tecnológica y logística.</p>

      <h2>5. Modalidad de Movilidad y Transporte Privado de Pasajeros (Punto A a Punto B)</h2>
      <p>Nuestra plataforma incorpora la modalidad tecnológica de enlace y coordinación digital para la movilidad urbana de pasajeros de punto a punto bajo las siguientes cláusulas obligatorias y regulatorias:</p>
      <ul>
        <li><b>Naturaleza del Servicio (Intermediación Tecnológica):</b> Se deja expresa, categórica e inequívocamente establecido que la Plataforma es exclusivamente una herramienta informática y tecnológica de intermediación digital entre usuarios pasajeros y conductores independientes. <b>FrutiGo Technologies y FrutiGo Logistics NO son una empresa de transporte público ni privado de personas, NO son concesionarios de taxis ni de radiotaxis, NO son propietarios ni administradores de los vehículos utilizados, y NO ostentan relación laboral, de subordinación, patrón-empleado ni agencia con los conductores independientes</b>. Cada conductor opera como un prestador de servicios autónomo, independiente y por cuenta propia.</li>
        <li><b>Conductores y Vehículos (Requisitos y Responsabilidad Exclusiva):</b> Todo conductor independiente que se registre u opere en la Plataforma debe acreditar, presentar y mantener permanentemente vigentes:
          <ol style="margin-top: 6px; padding-left: 20px;">
            <li>Licencia de conducir oficial y vigente expedida por la autoridad de transporte competente, idónea para la modalidad de transporte de personas.</li>
            <li>Tarjeta de circulación vehicular oficial y vigente.</li>
            <li>Póliza de seguro automotriz vigente con cobertura de responsabilidad civil para pasajeros o seguro especial para transporte privado de personas / ERyT / comercial emitido por una institución debidamente autorizada por la Comisión Nacional de Seguros y Fianzas (CNSF), que ampare daños a terceros y cobertura médica integral para ocupantes y pasajeros.</li>
          </ol>
          <b>El conductor independiente es el único y exclusivo responsable del estado mecánico, técnico, físico, de seguridad, higiene y legal del vehículo utilizado</b>, así como de portar toda la documentación reglamentaria y acatar en todo momento las leyes, reglamentos de tránsito y disposiciones de movilidad aplicables.
        </li>
        <li><b>Suspensión Automática por Vencimiento de Documentación:</b> La Plataforma cuenta con un sistema automatizado de control de vigencia documental. El sistema notificará de manera preventiva al conductor con <b>treinta (30) días naturales de anticipación</b> al vencimiento de su licencia de conducir o póliza de seguro vehicular. Si el conductor no renueva, carga y valida la documentación actualizada antes o en la fecha límite de vencimiento, <b>el sistema suspenderá y bloqueará automáticamente su cuenta de conductor</b>, inhabilitándolo de inmediato para recibir o aceptar cualquier solicitud de viaje hasta que los documentos renovados sean formalmente aprobados por el equipo de cumplimiento.</li>
        <li><b>Negociación Directa, Moneda Contractual y Pago en Efectivo:</b> La determinación de las tarifas de cada viaje de punto a punto (Punto A a Punto B) se realiza bajo un modelo de <b>negociación directa y consentimiento mutuo</b> entre el usuario pasajero y el conductor independiente a través de la aplicación. <b>El pago del servicio se efectúa directamente en efectivo al conductor independiente al término del trayecto</b> (o a través de los medios directos previamente acordados entre las partes). <b>La plataforma Fruti Go NO procesa, NO cobra, NO retiene ni intermedia las tarifas pactadas de los viajes entre particulares en esta modalidad</b>, salvo las cuotas fijas de suscripción, recarga o membresía por el uso del software por parte de los conductores. La moneda legal, base y obligatoria para fines contractuales y de referencia es el <b>Peso Mexicano (MXN)</b>; cualquier valor en divisas extranjeras es puramente estimativo e informativo.</li>
        <li><b>Seguridad y Exención de Responsabilidad de la Plataforma:</b> FrutiGo Technologies y FrutiGo Logistics quedan formalmente exentas de cualquier responsabilidad civil, extracontractual, penal, laboral o patrimonial derivada de:
          <ol style="margin-top: 4px; padding-left: 20px;">
            <li>Siniestros viales, colisiones, choques, volcaduras, infracciones o accidentes de tránsito ocurridos durante o en relación con el viaje.</li>
            <li>Pérdidas, olvido, extravío, robo o deterioro de bultos, equipaje o cualquier objeto personal dentro de la unidad vehicular.</li>
            <li>Conductas, agresiones, actos u omisiones de terceros, conductores independientes o pasajeros.</li>
            <li>Disputas, diferencias o controversias tarifarias suscitadas antes, durante o con posterioridad a la prestación del servicio.</li>
          </ol>
          Ante cualquier hecho o siniestro vial, <b>la atención médica primaria, peritajes, asistencias legales y cobertura de indemnizaciones recaen exclusiva y prioritariamente sobre la póliza de seguro automotriz vigente y obligatoria del vehículo del conductor independiente</b>.
        </li>
      </ul>
      
      <h2>6. Módulo de Servicios Logísticos, Mensajería y Envíos Urbanos</h2>
      <p>A través de nuestra plataforma tecnológica <b>FrutiGo Logistics</b>, facilitamos la asignación, trazabilidad y control de despacho de paquetería urbana:</p>
      <ul>
        <li><b>Declaración de Contenido:</b> El remitente es responsable de la legalidad de los artículos transportados. Se prohíbe el envío de mercancías ilícitas, sustancias peligrosas, dinero en efectivo o valores no declarados.</li>
        <li><b>Protocolos de Seguridad e Inspección:</b> Por seguridad y normatividad, los operadores asignados pueden verificar el embalaje antes de iniciar el trayecto logístico.</li>
      </ul>

      <h2>7. Módulo Especializado de Transporte de Mascotas (Pet Mobility)</h2>
      <p>Nuestra división de movilidad asistida establece protocolos específicos de seguridad para el transporte de animales de compañía:</p>
      <ul>
        <li><b>Condiciones de Sujeción y Traslado:</b> Es obligatorio el uso de transportadora homologada o arnés de seguridad para vehículos.</li>
        <li><b>Responsabilidad y Bienestar:</b> El usuario garantiza que la mascota cumple con los esquemas de vacunación correspondientes y asume la responsabilidad de cubrir gastos de limpieza o daños materiales al vehículo si correspondiera.</li>
      </ul>

      <h2>8. Garantías, Devoluciones y Conciliación Financiera con Openpay</h2>
      <ul>
        <li><b>Garantía de Inocuidad y Calidad:</b> Los reportes de inconformidad en productos perecederos de la tienda deben notificarse en un lapso de 24 horas naturales con evidencia fotográfica al WhatsApp 3317093598 o correo de soporte.</li>
        <li><b>Procesamiento de Reembolsos:</b> Las devoluciones autorizadas se tramitan automáticamente a través de la pasarela segura <b>Openpay by BBVA</b> conforme a los tiempos bancarios interbancarios establecidos.</li>
      </ul>

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
        <p style="font-size: 13px; color: #52525b; margin: 0;"><strong>Dirección Jurídica, Cumplimiento y Liderazgo Institucional:</strong></p>
        <p style="font-size: 14px; font-weight: bold; color: #0D7A3F; margin: 2px 0 0 0;">Alberto Reyes Sandoval</p>
        <p style="font-size: 12px; color: #71717a; margin: 0;">Fundador y CEO — FrutiGo Technologies & FrutiGo Logistics</p>
      </div>
    `,
    privacidad: `
      <h1>Aviso de Privacidad Integral Corporativo</h1>
      <p class="text-xs text-zinc-400 -mt-2 mb-6">Última actualización: Septiembre de 2026</p>
      
      <h2>1. Identidad y Domicilio de las Entidades Responsables</h2>
      <p><b>FrutiGo Technologies</b> y <b>FrutiGo Logistics</b>, legalmente representadas por su <b>Fundador y CEO, Alberto Reyes Sandoval</b>, con domicilio operativo y fiscal en <b>San Rafael 2790, Col. El Campanario, CP 45234, Guadalajara, Jalisco, México</b>, correo de contacto <b>frutigo33@gmail.com</b> y teléfono <b>3317093598</b>, somos los responsables del tratamiento, resguardo y protección de sus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y los estándares obligatorios de cumplimiento y transparencia de Google Play Store.</p>
      
      <p>Nuestra infraestructura da soporte a tres perfiles operativos: <b>Usuarios y Pasajeros (Clientes)</b>, <b>Conductores y Repartidores Logísticos Independientes</b> y <b>Comercios y Proveedores Aliados</b>.</p>
      
      <h2>2. Categorías de Datos Personales Tratados</h2>
      <ul>
        <li><b>Datos de Identificación y Registro:</b> Nombre completo, razón social, correo electrónico, número telefónico y credenciales de acceso autenticadas.</li>
        <li><b>Datos de Conductores:</b> Licencia de conducir, póliza de seguro automotriz vigente, tarjeta de circulación y datos de identificación vehicular.</li>
        <li><b>Datos de Auditoría y Telemetría:</b> Identificadores únicos de dispositivo, versión de sistema operativo, registros de acceso e historial de órdenes o viajes.</li>
      </ul>

      <h2>3. Tratamiento Crítico de Ubicación Geográfica (Conforme a Requisitos y Políticas de Google Play)</h2>
      <p>La recopilación y procesamiento de datos de geolocalización es fundamental para la operatividad y seguridad de la plataforma y se rige bajo los siguientes lineamientos transparentes:</p>
      <ul>
        <li><b>A. Datos de Geolocalización en Tiempo Real (GPS):</b>
          La aplicación recopila la ubicación exacta (en primer plano y en segundo plano) del dispositivo móvil con las siguientes finalidades esenciales:
          <ol style="margin-top: 4px; padding-left: 20px;">
            <li><b>Emparejamiento de Viajes:</b> Conectar en tiempo real a usuarios pasajeros con los conductores independientes más cercanos de forma eficiente.</li>
            <li><b>Seguimiento en Vivo de la Ruta:</b> Trazar, proyectar y visualizar el trayecto exacto del viaje en curso sobre mapas interactivos.</li>
            <li><b>Seguridad Integral y Asistencia:</b> Garantizar la certidumbre y resguardo de ambas partes (pasajero y conductor) durante todo el servicio de movilidad, alertar ante desvíos y coordinar auxilio ante emergencias viales.</li>
          </ol>
        </li>
        <li><b>B. Permisos de la App y Directivas de Google Play (Foreground y Background Location):</b>
          En estricto apego a las directivas y lineamientos para desarrolladores de Google Play sobre aplicaciones de transporte, logística y movilidad privada:
          <div style="background: #f0fdf4; border-left: 4px solid #0D7A3F; padding: 14px 18px; border-radius: 8px; margin: 10px 0;">
            <p style="margin: 0; font-weight: bold; color: #0D7A3F;">Declaración de Divulgación Prominente (Google Play Prominent Disclosure):</p>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #166534;">
              <b>Fruti Go solicita permisos de ubicación precisa (FOREGROUND LOCATION) y en segundo plano (BACKGROUND LOCATION). Recopilamos datos de ubicación exacta incluso cuando la app está cerrada o no está en pantalla, exclusivamente para permitir la asignación de viajes cercanos y el monitoreo de seguridad en ruta de los conductores en servicio.</b>
            </p>
          </div>
          Esta recopilación en segundo plano se activa <b>única y exclusivamente cuando el conductor independiente se encuentra activamente en estado "En Línea / Conectado / En Servicio"</b> (por ejemplo, navegando en Google Maps o Waze con la app en segundo plano), y <b>se interrumpe y cancela de manera inmediata y automática</b> en el momento en que el conductor cambie su estado a "Desconectado" o cierre la sesión de la aplicación.
        </li>
        <li><b>C. Compartición Mutua de Datos para el Viaje:</b>
          Durante la coordinación y ejecución de un viaje de movilidad urbana, la plataforma comparte mutuamente entre el usuario pasajero y el conductor independiente asignado los siguientes datos con fines de reconocimiento visual, coordinación logística y seguridad:
          <ol style="margin-top: 4px; padding-left: 20px;">
            <li><b>Datos compartidos con el pasajero:</b> Nombre completo y fotografía de perfil del conductor independiente; marca, submarca, modelo, color y número de placas del vehículo automotor; y geolocalización en tiempo real de la unidad desde su aproximación hasta el destino.</li>
            <li><b>Datos compartidos con el conductor:</b> Nombre de pila y fotografía de perfil del pasajero, punto exacto de abordaje (Punto A), punto de destino (Punto B) y geolocalización en tiempo real durante el trayecto.</li>
          </ol>
          Dichos datos se utilizan única y exclusivamente para la ejecución del viaje solicitado y no son transferidos ni comercializados a terceras partes bajo ninguna circunstancia.
        </li>
      </ul>

      <h2>4. Seguridad de Pagos y Cifrado Bancario (Openpay by BBVA)</h2>
      <p>Todas las transacciones se realizan mediante conexión cifrada con <b>Openpay (by BBVA)</b> con certificación bancaria PCI-DSS Nivel 1. FrutiGo Technologies no recopila ni almacena información de tarjetas de crédito o débito en sus bases de datos.</p>

      <h2>5. Finalidades Primarias y Secundarias del Tratamiento</h2>
      <ul>
        <li>Gestión, autenticación y administración de cuentas operativas de usuarios y conductores.</li>
        <li>Procesamiento algorítmico, asignación y coordinación de viajes de pasajeros y órdenes logísticas.</li>
        <li>Soporte técnico, monitoreo de incidentes viales y aseguramiento de calidad y seguridad.</li>
        <li>Cumplimiento con obligaciones legales, fiscales y regulatorias aplicables.</li>
      </ul>

      <h2>6. Ejercicio de Derechos ARCO y Eliminación de Cuentas</h2>
      <p>Usted puede ejercer en cualquier momento sus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO) o solicitar la eliminación total de sus datos y cuenta a través de nuestro portal automatizado en <a href="/cuenta" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo.com.mx/cuenta</a> o escribiendo a nuestro oficial de cumplimiento en <a href="mailto:frutigo33@gmail.com" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo33@gmail.com</a>.</p>

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
        <p style="font-size: 13px; color: #52525b; margin: 0;"><strong>Oficialía de Privacidad y Cumplimiento Normativo:</strong></p>
        <p style="font-size: 14px; font-weight: bold; color: #0D7A3F; margin: 2px 0 0 0;">Alberto Reyes Sandoval</p>
        <p style="font-size: 12px; color: #71717a; margin: 0;">Fundador y CEO — FrutiGo Technologies & FrutiGo Logistics</p>
      </div>
    `,
    nosotros: `
      <h1>FrutiGo Technologies — Infraestructura Logística y Comercio Digital</h1>
      <p>En <b>FrutiGo Technologies</b> conectamos comercios locales, restaurantes y clientes finales mediante tecnología de ruteo eficiente y una cadena de suministro digitalizada. Nuestra infraestructura elimina intermediarios innecesarios, optimiza la logística de última milla y asegura la máxima frescura y trazabilidad de productos agroalimentarios.</p>
      
      <h2>Pilares Corporativos</h2>
      <ul>
        <li><b>Logística Inteligente:</b> Ruteo optimizado en tiempo real y despacho de última milla con asignación dinámica de flota.</li>
        <li><b>Comercio B2B Integrado:</b> Abastecimiento directo para negocios, restaurantes y mayoristas con catálogos corporativos y facturación formal.</li>
        <li><b>Escalabilidad y Seguridad:</b> Pagos procesados de forma segura, alta disponibilidad y soporte operativo continuo.</li>
      </ul>

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
        <p style="font-size: 13px; color: #52525b; margin: 0;"><strong>Liderazgo Institucional:</strong></p>
        <p style="font-size: 14px; font-weight: bold; color: #0D7A3F; margin: 2px 0 0 0;">FrutiGo Technologies — Dirección General y Equipo de Ingeniería</p>
      </div>
    `,
    soporte: `
      <h1>Centro Corporativo de Soporte y Operaciones | FrutiGo</h1>
      <p>En <b>FrutiGo Technologies</b> y <b>FrutiGo Logistics</b> nuestro equipo de soporte técnico y operaciones está disponible para atender cualquier consulta corporativa, incidencia de entrega, facturación electrónica (CFDI) o asistencia técnica.</p>
      
      <div style="background: #f9f9f9; border-left: 5px solid #0D7A3F; padding: 25px; border-radius: 12px; margin: 24px 0; color: #333;">
        <p style="margin-bottom: 12px;"><strong>📧 Mesa de Ayuda y Soporte Técnico:</strong> <a href="mailto:frutigo33@gmail.com" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo33@gmail.com</a></p>
        <p style="margin-bottom: 12px;"><strong>📞 Central de Operaciones y WhatsApp:</strong> <a href="https://wa.me/523317093598" target="_blank" rel="noopener noreferrer" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">3317093598</a></p>
        <p style="margin-bottom: 0;"><strong>⏰ Horario Operativo:</strong> Lunes a Viernes de 09:00 a 18:00 hrs. (Hora del Centro de México)</p>
      </div>
      
      <h2>Protocolo de Atención Ágil:</h2>
      <p>Para canalizar eficientemente su solicitud, le sugerimos indicar su ID de usuario o número de orden junto con el detalle de su consulta.</p>

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
        <p style="font-size: 13px; color: #52525b; margin: 0;"><strong>Dirección de Operaciones y Sistemas:</strong></p>
        <p style="font-size: 14px; font-weight: bold; color: #0D7A3F; margin: 2px 0 0 0;">FrutiGo Technologies — Mesa Central de Operaciones y Soporte</p>
        <p style="font-size: 12px; color: #71717a; margin: 0;">FrutiGo Technologies & FrutiGo Logistics</p>
      </div>
    `,
  },
  en: {
    politicas: `
      <h1>Fruti Go Service and Quality Policies</h1>
      <p>At Fruti Go, our mission is to guarantee that you receive the freshest farm products directly to your home. These policies govern our operations and our commitment to you.</p>
      
      <h2>1. Quality Standards</h2>
      <p>Every fruit and vegetable is hand-picked by experts. If any product does not meet your expectations for freshness upon delivery, you have our <b>Total Satisfaction Guarantee</b> for an immediate replacement.</p>
      
      <h2>2. Secure Payments with Openpay</h2>
      <p>Your financial security is paramount. All credit, debit card, and transfer transactions on our platform are processed securely through <b>Openpay by BBVA</b>. This guarantees that your banking details are never stored on our servers and are protected under the industry's highest security standards (PCI DSS).</p>
      
      <h2>3. Delivery Policy</h2>
      <p>We operate in the metropolitan area of Guadalajara and surrounding areas. Orders are scheduled with total route transparency to ensure they arrive in optimal condition.</p>
      
      <h2>4. Cancellations</h2>
      <p>Because we handle perishable products, cancellations must be made free of charge at least 2 hours prior to the scheduled delivery window.</p>
    `,
    terminos: `
      <h1>Terms and Conditions of Use and Services</h1>
      <p class="text-xs text-zinc-400 -mt-2 mb-6">Last updated: September 2026</p>
      
      <p>Welcome to <b>FrutiGo Technologies</b> and <b>FrutiGo Logistics</b>, legally represented by its <b>Founder and CEO, Alberto Reyes Sandoval</b>. These Terms and Conditions govern access, registration, and use of our technological platforms, mobile applications, API interfaces, urban mobility services, and logistics solutions (hereinafter, "the Platform"). Our digital infrastructure is owned by <b>FrutiGo Technologies</b> and operated by <b>FrutiGo Logistics</b>, located at <b>San Rafael 2790, Col. El Campanario, CP 45234, Guadalajara, Jalisco, Mexico</b>, email <b>frutigo33@gmail.com</b> and phone <b>+52 3317093598</b>. Using our services constitutes full and binding acceptance of these terms.</p>
      
      <h2>1. Digital Infrastructure and Platform Use</h2>
      <ul>
        <li><b>Access Requirements:</b> Users must be at least 18 years old and possess full legal capacity to enter into binding agreements under applicable laws.</li>
        <li><b>License:</b> A limited, non-transferable, non-exclusive, and revocable software license is granted to use our applications for authorized personal, commercial, logistics, and private mobility purposes.</li>
        <li><b>Operational Restrictions:</b> Reverse engineering, decompiling, unauthorized scraping, or using the platform for fraudulent or unlawful activities is strictly prohibited.</li>
      </ul>
      
      <h2>2. Corporate and Individual Accounts</h2>
      <p>Users and registered entities are exclusively responsible for safeguarding their login credentials and the veracity of supplied data. FrutiGo Technologies employs robust authentication protocols and encryption to protect account integrity.</p>
      
      <h2>3. Intellectual Property and Technology Architecture</h2>
      <p>All trademarks, logos, software architectures, algorithms, routing systems, and content belong exclusively to <b>FrutiGo Technologies</b> under the ownership of Founder and CEO <b>Alberto Reyes Sandoval</b>. Unauthorized reproduction or exploitation is prohibited under intellectual property laws.</p>
      
      <h2>4. Service Level and General Limitation of Liability</h2>
      <p>FrutiGo Technologies provides cloud infrastructure with high availability. Services are delivered on an "as is" and "as available" basis under professional industry standards.</p>

      <h2>5. Private Passenger Mobility and Transportation (Point A to Point B)</h2>
      <p>Our digital platform incorporates a passenger mobility intermediation module under the following mandatory regulatory and contractual terms:</p>
      <ul>
        <li><b>Platform Nature (Technological Intermediation):</b> The platform operates exclusively as a digital technological tool connecting passenger users with independent private drivers. It is explicitly declared that <b>FrutiGo Technologies and FrutiGo Logistics are NOT a public or private transportation enterprise, NOT a taxi concessionaire or taxi dispatch service, do NOT own or lease vehicles, and maintain NO employer-employee, subordinate, or agency relationship with independent drivers</b>. Each driver operates as an autonomous independent contractor.</li>
        <li><b>Mandatory Driver and Vehicle Documentation:</b> Every registered independent driver must hold and maintain valid and up-to-date documentation at all times:
          <ol style="margin-top: 6px; padding-left: 20px;">
            <li>Official valid driver's license issued by competent transportation authorities for passenger transport.</li>
            <li>Official valid vehicle circulation card (tarjeta de circulación).</li>
            <li>Active commercial auto insurance policy covering passenger transportation / multi-platform ridesharing issued by an authorized insurance company (CNSF regulated), guaranteeing civil liability to third parties and medical expenses for vehicle occupants and passengers.</li>
          </ol>
        </li>
        <li><b>Automatic Account Suspension for Expired Documents:</b> The platform monitors document validity automatically. The system sends preventive notices to the driver <b>30 calendar days prior</b> to the expiration of their driver's license or insurance policy. If the driver fails to renew and submit verified documents before or on the expiration date, <b>the system automatically suspends and locks the driver's account</b>, immediately preventing them from receiving or accepting ride requests until approved by compliance staff.</li>
        <li><b>Fares, Direct Negotiation, and Base Currency (MXN / USD):</b> Fares for point-to-point trips (Point A to Point B) are established via <b>direct negotiation and mutual consent</b> between passenger and driver through the application interface. <b>The base, official, and legally binding currency is the Mexican Peso (MXN)</b>. Any price display, estimate, or conversion in US Dollars (USD) or other currencies is strictly <b>referential, informative, and estimated</b> for international tourists or visitors. All charges are settled in Mexican Pesos (MXN) and are subject to exchange rates and international transaction fees applied by the user's card-issuing bank.</li>
        <li><b>Accidents, Collisions, and Liability Delimitation:</b> In the event of any traffic accident or collision during a trip arranged through the platform, <b>emergency medical coverage, appraisals, and civil liabilities are primarily and directly covered by the driver's compulsory vehicle insurance policy</b>. FrutiGo Technologies assumes no direct civil or tort liability for vehicular accidents, driving conduct, or traffic infractions.</li>
      </ul>

      <h2>6. Courier and Urban Logistics Module</h2>
      <p>Through <b>FrutiGo Logistics</b>, we facilitate urban parcel dispatch, tracking, and delivery:</p>
      <ul>
        <li><b>Content Declaration:</b> The sender warrants the lawful nature of items shipped. Prohibited items include hazardous materials, illicit substances, cash, or undeclared valuables.</li>
        <li><b>Inspection and Safety Protocols:</b> Operators reserve the right to inspect packaging prior to transit for safety compliance.</li>
      </ul>

      <h2>7. Specialized Pet Transportation (Pet Mobility)</h2>
      <p>Our pet mobility service enforces safety guidelines:</p>
      <ul>
        <li><b>Restraint and Carrier:</b> Pets must be secured in an approved carrier or vehicle harness. Leashes and muzzles are required for medium/large dogs if reactive.</li>
        <li><b>Hygiene and Damages:</b> The user assumes responsibility for pet vaccinations, hygiene, and any vehicle cleaning costs caused by the pet.</li>
      </ul>

      <h2>8. Warranties, Returns, and Refunds with Openpay</h2>
      <ul>
        <li><b>Freshness Guarantee:</b> Fresh produce claims must be submitted within 24 hours of delivery with photographic evidence via WhatsApp +52 3317093598 or support email.</li>
        <li><b>Refund Processing:</b> Authorized refunds are processed automatically through <b>Openpay by BBVA</b> adhering to interbank processing timelines.</li>
      </ul>

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
        <p style="font-size: 13px; color: #52525b; margin: 0;"><strong>Legal, Regulatory Compliance & Executive Leadership:</strong></p>
        <p style="font-size: 14px; font-weight: bold; color: #0D7A3F; margin: 2px 0 0 0;">Alberto Reyes Sandoval</p>
        <p style="font-size: 12px; color: #71717a; margin: 0;">Founder & CEO — FrutiGo Technologies & FrutiGo Logistics</p>
      </div>
    `,
    privacidad: `
      <h1>Comprehensive Corporate Privacy Notice</h1>
      <p class="text-xs text-zinc-400 -mt-2 mb-6">Last updated: September 2026</p>
      
      <h2>1. Personal Data Controller</h2>
      <p><b>FrutiGo Technologies</b> and <b>FrutiGo Logistics</b>, legally represented by <b>Founder & CEO Alberto Reyes Sandoval</b>, located at <b>San Rafael 2790, Col. El Campanario, CP 45234, Guadalajara, Jalisco, Mexico</b>, email <b>frutigo33@gmail.com</b> and phone <b>+52 3317093598</b>, are responsible for collecting, safeguarding, and processing your personal data in full compliance with the Mexican Data Protection Law (LFPDPPP) and Google Play Store mandatory privacy policies.</p>
      
      <p>Our infrastructure supports three distinct operational profiles: <b>Passenger Users & Clients</b>, <b>Independent Drivers & Couriers</b>, and <b>Allied Merchants</b>.</p>
      
      <h2>2. Categories of Personal Data Collected</h2>
      <ul>
        <li><b>Identification & Contact Data:</b> Full name, email address, phone number, and authenticated login credentials.</li>
        <li><b>Driver Documentation:</b> Driver's license, active vehicle insurance policy, registration card, and vehicle specifications.</li>
        <li><b>Telemetry & Device Data:</b> Unique device identifiers, operating system version, access logs, and trip history.</li>
      </ul>

      <h2>3. Critical Geolocation Data Processing (Google Play Compliance)</h2>
      <p>Location data processing is essential to platform operation and is governed by strict technical guidelines:</p>
      <ul>
        <li><b>A. Passenger Location (Foreground Location):</b>
          We collect precise location data from passenger devices <b>strictly in the foreground</b> (only while the application is open and visible on screen) and exclusively upon explicit device authorization. This data is used to:
          <ol style="margin-top: 4px; padding-left: 20px;">
            <li>Detect and pinpoint the exact pick-up point (Point A) and suggest drop-off destinations (Point B).</li>
            <li>Calculate optimal routes and transparent estimated fares.</li>
            <li>Provide real-time ride tracking during an active trip for navigation and personal safety.</li>
          </ol>
        </li>
        <li><b>B. Independent Driver Location (Background Location — Google Play Prominent Disclosure):</b>
          <div style="background: #f0fdf4; border-left: 4px solid #0D7A3F; padding: 14px 18px; border-radius: 8px; margin: 10px 0;">
            <p style="margin: 0; font-weight: bold; color: #0D7A3F;">Google Play Prominent Disclosure:</p>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #166534;">
              <b>FrutiGo collects precise real-time location data from independent drivers even when the app is closed or running in the background (Background Location).</b>
            </p>
          </div>
          Background location collection is subject to the following strict conditions:
          <ol style="margin-top: 6px; padding-left: 20px;">
            <li><b>Conditional Activation:</b> Background location operates <b>ONLY while the driver has explicitly set their status to "Online / Connected / On Duty"</b> in the application.</li>
            <li><b>Legitimate Purposes:</b>
              <ul style="margin-top: 4px; padding-left: 16px;">
                <li>Assign nearby ride and delivery requests in real time while the driver is using external navigation apps (such as Google Maps or Waze) or while the device screen is locked.</li>
                <li>Calculate accurate Estimated Time of Arrival (ETA) for passengers.</li>
                <li>Ensure in-transit safety monitoring, route tracing, and rapid emergency assistance dispatch.</li>
              </ul>
            </li>
            <li><b>Immediate Deactivation:</b> Background location collection <b>stops immediately and automatically</b> the moment the driver toggles their status to "Offline / Off Duty" or signs out.</li>
          </ol>
          <p style="margin-top: 6px; font-size: 12px; color: #52525b;"><i>FrutiGo NEVER sells, rents, or shares location data with third parties for advertising or tracking purposes.</i></p>
        </li>
      </ul>

      <h2>4. Secure Financial Transactions (Openpay by BBVA)</h2>
      <p>Card payments and financial data are handled directly through <b>Openpay by BBVA</b> using SSL encryption and certified PCI-DSS Level 1 compliance. FrutiGo never stores card numbers on its servers.</p>

      <h2>5. Purposes of Data Processing</h2>
      <ul>
        <li>Account creation, authentication, and management for users and drivers.</li>
        <li>Algorithmic dispatch, coordination, and fulfillment of passenger rides and deliveries.</li>
        <li>Technical customer support, route safety monitoring, and incident management.</li>
        <li>Legal, tax, and regulatory compliance.</li>
      </ul>

      <h2>6. ARCO Rights and Automated Account Deletion</h2>
      <p>You may exercise your Access, Rectification, Cancellation, and Opposition (ARCO) rights or request complete <b>account deletion</b> at any time via our automated portal at <a href="/cuenta" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo.com.mx/cuenta</a> or by contacting our compliance officer at <a href="mailto:frutigo33@gmail.com" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo33@gmail.com</a>.</p>

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
        <p style="font-size: 13px; color: #52525b; margin: 0;"><strong>Privacy, Compliance & Institutional Governance:</strong></p>
        <p style="font-size: 14px; font-weight: bold; color: #0D7A3F; margin: 2px 0 0 0;">Alberto Reyes Sandoval</p>
        <p style="font-size: 12px; color: #71717a; margin: 0;">Founder & CEO — FrutiGo Technologies & FrutiGo Logistics</p>
      </div>
    `,
    nosotros: `
      <h1>About Us</h1>
      <p>Welcome to Fruti Go!</p>
      
      <p>At Fruti Go, we are passionate about freshness, technology, and convenience. This application was created and developed by <b>Fruti Go</b> to simplify how you purchase and receive fruits, vegetables, and fresh produce, bringing freshness right to the palm of your hand.</p>
      
      <h2>Our Mission</h2>
      <p>Connecting people with practical, efficient, and reliable solutions through intuitive technology, always guaranteeing maximum quality and close customer care.</p>
      
      <h2>Why Choose Fruti Go?</h2>
      <ul>
        <li><b>Local Development:</b> Created with dedication to solve real local needs of our users.</li>
        <li><b>Ease of Use:</b> A clean, fast interface for hassle-free shopping.</li>
        <li><b>Commitment:</b> Backed by a dedicated team ready to listen and improve every day.</li>
      </ul>
    `,
    soporte: `
      <h1>Support and Customer Service</h1>
      <p>Have questions, technical issues, or suggestions for Fruti Go? We are here to help ensure you have the best experience.</p>
      
      <div style="background: #f9f9f9; border-left: 5px solid #0D7A3F; padding: 25px; border-radius: 12px; margin: 24px 0; color: #333;">
        <p style="margin-bottom: 12px;"><strong>📧 Email:</strong> <a href="mailto:frutigo33@gmail.com" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo33@gmail.com</a></p>
        <p style="margin-bottom: 12px;"><strong>📞 Phone / WhatsApp:</strong> <a href="https://wa.me/523317093598" target="_blank" rel="noopener noreferrer" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">3317093598</a></p>
        <p style="margin-bottom: 0;"><strong>⏰ Business Hours:</strong> Monday to Friday from 09:00 to 18:00 hrs.</p>
      </div>
      
      <h2>Tip for Faster Support:</h2>
      <p>When sending an email, please include:</p>
      <ol>
        <li>Your registered username in the app.</li>
        <li>A brief description of the issue and, if possible, a screenshot.</li>
      </ol>
      We will respond within <b>24 to 48 business hours</b>.
    `,
  },
  pt: {
    politicas: `
      <h1>Políticas de Serviço e Qualidade Fruti Go</h1>
      <p>No Fruti Go, nossa missão é garantir que você receba os produtos mais frescos do campo diretamente na sua casa. Estas políticas regem nossa operação e compromisso com você.</p>
      
      <h2>1. Padrões de Qualidade</h2>
      <p>Cada fruta e verdura é selecionada à mão por especialistas. Se algum produto não atender às suas expectativas de frescor no momento da entrega, você conta com nossa <b>Garantia de Satisfação Total</b> para substituição imediata.</p>
      
      <h2>2. Pagamentos Seguros com Openpay</h2>
      <p>Sua segurança financeira é nossa prioridade. Todas as transações com cartão de crédito, débito e transferência dentro da nossa plataforma são processadas de forma segura através do <b>Openpay by BBVA</b>. Isso garante que seus dados bancários nunca sejam armazenados em nossos servidores e permaneçam protegidos pelos mais altos padrões da indústria (PCI DSS).</p>
      
      <h2>3. Política de Entregas</h2>
      <p>Operamos na área metropolitana de Guadalajara e regiões vizinhas. Os pedidos são agendados com total transparência de rota para garantir que cheguem em condições ideais.</p>
      
      <h2>4. Cancelamentos</h2>
      <p>Por trabalharmos com produtos perecíveis, os cancelamentos devem ser feitos com no mínimo 2 horas de antecedência da janela de entrega agendada sem qualquer custo.</p>
    `,
    terminos: `
      <h1>Termos e Condições de Uso e Serviços</h1>
      <p class="text-xs text-zinc-400 -mt-2 mb-6">Última atualização: Setembro de 2026</p>
      
      <p>Bem-vindo à <b>FrutiGo Technologies</b> e <b>FrutiGo Logistics</b>, fundadas e representadas legalmente pelo seu <b>Fundador e CEO, Alberto Reyes Sandoval</b>. Estes Termos e Condições regulam o acesso, registro e uso das nossas plataformas tecnológicas, aplicativos móveis, APIs, serviços de mobilidade urbana e soluções logísticas (adiante, "a Plataforma"). Nossa infraestrutura é propriedade da <b>FrutiGo Technologies</b> e operada pela <b>FrutiGo Logistics</b>, com domicílio na <b>San Rafael 2790, Col. El Campanario, CP 45234, Guadalajara, Jalisco, México</b>, e-mail <b>frutigo33@gmail.com</b> e telefone <b>3317093598</b>. O uso de nossos serviços implica a aceitação integral destes termos.</p>
      
      <h2>1. Uso da Plataforma e Infraestrutura Digital</h2>
      <ul>
        <li><b>Requisitos de Acesso:</b> O usuário deve ter pelo menos 18 anos de idade e capacidade jurídica para contratar segundo as leis aplicáveis no México.</li>
        <li><b>Licença de Uso:</b> Concede-se uma licença limitada, não exclusiva, não transferível e revogável para usar nossos aplicativos para compras, logística e mobilidade privada autorizados.</li>
        <li><b>Restrições Operativas:</b> É estritamente proibido modificar, descompilar, fazer engenharia reversa ou utilizar o app para fins ilícitos ou fraudulentos.</li>
      </ul>
      
      <h2>2. Contas de Usuário e Segurança</h2>
      <p>Para acessar determinadas funções (como pedidos, viagens ou histórico), o usuário deverá se cadastrar. É responsabilidade do usuário manter o sigilo de suas credenciais de acesso. A Plataforma implementa protocolos robustos de autenticação e criptografia.</p>
      
      <h2>3. Propriedade Intelectual e Arquitetura Tecnológica</h2>
      <p>Todos os direitos de propriedade intelectual, código-fonte, algoritmos, logotipos e conteúdos da Plataforma pertencem exclusivamente à <b>FrutiGo Technologies</b> sob titularidade do seu <b>Fundador e CEO, Alberto Reyes Sandoval</b>.</p>
      
      <h2>4. Nível de Serviço e Limitação de Responsabilidade</h2>
      <p>A Plataforma é fornecida "como está" e "conforme disponível". A Empresa não garante que o serviço seja ininterrupto ou livre de erros. Não nos responsabilizamos por danos indiretos decorrentes do uso do aplicativo.</p>

      <h2>5. Modalidade de Mobilidade e Transporte Privado de Passageiros (Ponto A a Ponto B)</h2>
      <p>Nossa plataforma incorpora a modalidade tecnológica de intermediação digital para mobilidade urbana de passageiros de ponto a ponto sob as seguintes cláusulas obrigatórias:</p>
      <ul>
        <li><b>Natureza do Serviço (Intermediação Tecnológica):</b> Fica expressamente declarado que a Plataforma é uma ferramenta tecnológica de intermediação digital entre passageiros e motoristas independentes. <b>A FrutiGo Technologies e a FrutiGo Logistics NÃO são empresas de transporte público ou privado, NÃO são concessionárias de táxi, NÃO são proprietárias dos veículos e NÃO possuem vínculo empregatício ou de subordinação com os motoristas parceiros</b>. Cada motorista atua de forma autônoma e independente.</li>
        <li><b>Requisitos Obrigatórios para Motoristas e Veículos:</b> Todo motorista independente deve apresentar e manter válidos:
          <ol style="margin-top: 6px; padding-left: 20px;">
            <li>Carteira de habilitação oficial vigente, adequada para transporte de passageiros.</li>
            <li>Documento de licenciamento do veículo vigente.</li>
            <li>Apólice de seguro veicular com cobertura ampla específica para transporte de passageiros / comercial, com cobertura para danos a terceiros e despesas médicas para ocupantes.</li>
          </ol>
        </li>
        <li><b>Suspensão Automática por Vencimento de Documentos:</b> O sistema notificará preventivamente o motorista com <b>trinta (30) dias de antecedência</b> ao vencimento de sua habilitação ou seguro. Caso os documentos não sejam renovados e validados até a data de vencimento, <b>a conta do motorista será suspensa e bloqueada automaticamente</b> para novas corridas.</li>
        <li><b>Tarifas, Negociação Direta e Moeda Contratual (Multimoeda):</b> As tarifas de cada viagem (Ponto A a Ponto B) são determinadas por <b>negociação direta e acordo mútuo</b> entre passageiro e motorista independente. <b>A moeda contratual base oficial é o Peso Mexicano (MXN)</b>. Qualquer valor exibido em Dólares Americanos (USD) é puramente <b>referencial e informativo</b>.</li>
        <li><b>Sinistros, Acidentes e Limitação de Responsabilidade:</b> Em caso de colisão ou acidente de trânsito durante uma viagem, a cobertura médica e indenizações recaem primária e diretamente sobre a apólice de seguro automotriz vigente do motorista independente.</li>
      </ul>

      <h2>6. Condições do Módulo de Encomendas e Logística</h2>
      <p>O FrutiGo Logistics atua como intermediário tecnológico que conecta usuários e entregadores para fretes e transporte de mercadorias:</p>
      <ul>
        <li><b>Declaração de Conteúdo:</b> O usuário é o único responsável pela veracidade do conteúdo dos pacotes. É proibido o envio de mercadorias ilegais, substâncias perigosas ou dinheiro em espécie.</li>
        <li><b>Limites de Responsabilidade:</b> Não assumimos responsabilidade por embalagem inadequada ou perda de itens proibidos por estes termos.</li>
      </ul>

      <h2>7. Políticas de Transporte de Animais de Estimação (Pet Mobility)</h2>
      <ul>
        <li><b>Segurança e Contenção:</b> Obrigatório o uso de caixa de transporte (kennel) ou cinto de segurança veicular adequado para animais. Focinheira obrigatória para animais reativos.</li>
        <li><b>Higiene e Danos:</b> O usuário é responsável por qualquer dano ou sujeira no veículo causada pelo animal.</li>
        <li><b>Saúde:</b> O FrutiGo não presta serviço de resgate ou ambulância veterinária de emergência.</li>
      </ul>

      <h2>8. Políticas de Garantia, Devolução e Reembolso</h2>
      <ul>
        <li><b>Garantia de Frescor:</b> Prazo de <b>24 horas naturais</b> após o recebimento do pedido para relatar inconformidades via WhatsApp no 3317093598 ou e-mail de suporte.</li>
        <li><b>Reembolsos com Openpay:</b> Reembolsos aprovados são processados via <b>Openpay by BBVA</b> conforme os prazos bancários regulares.</li>
        <li><b>Cancelamentos:</b> Cancelamento sem custo com pelo menos 2 horas de antecedência da janela de entrega.</li>
      </ul>

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
        <p style="font-size: 13px; color: #52525b; margin: 0;"><strong>Representação e Assinatura Legal:</strong></p>
        <p style="font-size: 14px; font-weight: bold; color: #0D7A3F; margin: 2px 0 0 0;">Alberto Reyes Sandoval</p>
        <p style="font-size: 12px; color: #71717a; margin: 0;">Fundador e CEO — FrutiGo Technologies & FrutiGo Logistics</p>
      </div>
    `,
    privacidad: `
      <h1>Aviso de Privacidade Integral Corporativo</h1>
      <p class="text-xs text-zinc-400 -mt-2 mb-6">Última atualização: Setembro de 2026</p>
      
      <h2>1. Responsável pelos Dados Pessoais</h2>
      <p><b>FrutiGo Technologies</b> e <b>FrutiGo Logistics</b>, representadas pelo <b>Fundador e CEO, Alberto Reyes Sandoval</b>, e-mail <b>frutigo33@gmail.com</b>, telefone <b>3317093598</b>, com endereço na <b>San Rafael 2790, Col. El Campanario, CP 45234, Guadalajara, Jalisco, México</b>, são responsáveis pela proteção dos seus dados pessoais em conformidade com as leis aplicáveis e requisitos da Google Play Store.</p>
      
      <h2>2. Dados que Coletamos</h2>
      <ul>
        <li><b>Identificação e Contato:</b> Nome completo, e-mail, telefone e credenciais.</li>
        <li><b>Documentos de Motoristas:</b> Habilitação, seguro automotivo, documento do veículo.</li>
        <li><b>Telemetria e Dados Técnicos:</b> IP, modelo do aparelho, registros de viagem e pedidos.</li>
      </ul>

      <h2>3. Tratamento de Localização Geográfica (Requisitos Google Play)</h2>
      <ul>
        <li><b>A. Localização de Passageiros (Primeiro Plano / Foreground Location):</b> Coletamos localização precisa em tempo real unicamente em primeiro plano (quando o app está aberto na tela) com autorização do usuário, exclusivamente para definir ponto de embarque (Ponto A), traçar rota até o destino (Ponto B) e exibir trajeto em tempo real por segurança.</li>
        <li><b>B. Localização de Motoristas em Segundo Plano (Background Location Prominent Disclosure — Google Play):</b>
          <div style="background: #f0fdf4; border-left: 4px solid #0D7A3F; padding: 14px 18px; border-radius: 8px; margin: 10px 0;">
            <p style="margin: 0; font-weight: bold; color: #0D7A3F;">Declaração Prominente de Divulgação (Google Play):</p>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #166534;">
              <b>A FrutiGo coleta dados de localização precisa em segundo plano (Background Location) dos motoristas parceiros mesmo quando o aplicativo está fechado ou inativo.</b>
            </p>
          </div>
          <ol style="margin-top: 6px; padding-left: 20px;">
            <li><b>Condição:</b> Opera exclusivamente quando o motorista está com status <b>"Conectado / Em Serviço"</b>.</li>
            <li><b>Finalidade:</b> Atribuir corridas próximas em tempo real mesmo usando outros apps como Google Maps/Waze, calcular ETA com precisão e fornecer rastreamento de segurança.</li>
            <li><b>Desativação:</b> Interrompe-se imediatamente ao ficar <b>"Desconectado / Fora de Serviço"</b>.</li>
          </ol>
        </li>
      </ul>

      <h2>4. Pagamentos Seguros com Openpay</h2>
      <p>Todas as transações financeiras são processadas através da <b>Openpay (by BBVA)</b> com certificação PCI-DSS. A FrutiGo não armazena dados bancários ou números de cartão.</p>

      <h2>5. Direitos ARCO e Exclusão de Conta</h2>
      <p>Você pode solicitar a exclusão de seus dados ou conta a qualquer momento em <a href="/cuenta" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo.com.mx/cuenta</a> ou enviando e-mail para <a href="mailto:frutigo33@gmail.com" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo33@gmail.com</a>.</p>

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
        <p style="font-size: 13px; color: #52525b; margin: 0;"><strong>Oficial de Privacidade e Titular Legal:</strong></p>
        <p style="font-size: 14px; font-weight: bold; color: #0D7A3F; margin: 2px 0 0 0;">Alberto Reyes Sandoval</p>
        <p style="font-size: 12px; color: #71717a; margin: 0;">Fundador e CEO — FrutiGo Technologies & FrutiGo Logistics</p>
      </div>
    `,
    nosotros: `
      <h1>Sobre Nós</h1>
      <p>Bem-vindo ao Fruti Go!</p>
      
      <p>No Fruti Go, somos apaixonados por frescor, tecnologia e praticidade. Este aplicativo foi criado e desenvolvido pelo <b>Fruti Go</b> com o objetivo de simplificar a forma como você compra e recebe frutas, verduras e produtos frescos, levando o frescor direto para a palma da sua mão.</p>
      
      <h2>Nossa Missão</h2>
      <p>Conectar pessoas a soluções práticas, eficientes e confiáveis através de tecnologia intuitiva, garantindo sempre a máxima qualidade no serviço e um atendimento próximo.</p>
      
      <h2>Por que escolher o Fruti Go?</h2>
      <ul>
        <li><b>Desenvolvimento Local:</b> Criado com dedicação e focado em resolver necessidades reais dos nossos usuários locais.</li>
        <li><b>Facilidade de Uso:</b> Uma interface limpa e rápida para você comprar sem complicações.</li>
        <li><b>Compromiso:</b> Apoiado por uma equipe dedicada pronta para ouvir e melhorar a cada dia.</li>
      </ul>
    `,
    soporte: `
      <h1>Suporte e Atendimento ao Cliente</h1>
      <p>Tem alguma dúvida, problema técnico ou sugestão para o Fruti Go? Estamos aqui para ajudar você a ter a melhor experiência.</p>
      
      <div style="background: #f9f9f9; border-left: 5px solid #0D7A3F; padding: 25px; border-radius: 12px; margin: 24px 0; color: #333;">
        <p style="margin-bottom: 12px;"><strong>📧 E-mail:</strong> <a href="mailto:frutigo33@gmail.com" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo33@gmail.com</a></p>
        <p style="margin-bottom: 12px;"><strong>📞 Telefone / WhatsApp:</strong> <a href="https://wa.me/523317093598" target="_blank" rel="noopener noreferrer" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">3317093598</a></p>
        <p style="margin-bottom: 0;"><strong>⏰ Horário de Atendimento:</strong> Segunda a Sexta das 09:00 às 18:00 hrs.</p>
      </div>
      
      <h2>Dica para um suporte mais rápido:</h2>
      <p>Ao nos enviar um e-mail, por favor inclua:</p>
      <ol>
        <li>Seu nome de usuário cadastrado no app.</li>
        <li>Uma breve descrição do problema e, se possível, uma captura de tela.</li>
      </ol>
      Responderemos no prazo máximo de <b>24 a 48 horas úteis</b>.
    `,
  },
};

// ==========================================
// CURRENCY & STORE TRANSLATIONS
// ==========================================

export const MXN_TO_USD_RATE = 20;

export function formatPrice(priceMXN: number, lang: Language = "es"): string {
  if (lang === "en" || lang === "pt") {
    const usd = priceMXN / MXN_TO_USD_RATE;
    return `$${usd.toFixed(2)} USD`;
  }
  return `$${priceMXN.toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} MXN`;
}

export function getPriceValue(priceMXN: number, lang: Language = "es"): number {
  if (lang === "en" || lang === "pt") {
    return Number((priceMXN / MXN_TO_USD_RATE).toFixed(2));
  }
  return priceMXN;
}

export function getCurrencyCode(lang: Language = "es"): string {
  return (lang === "en" || lang === "pt") ? "USD" : "MXN";
}

export function getLocalizedCategory(category: string, lang: Language = "es"): string {
  if (lang === "es") return category;
  const map: Record<string, Record<string, string>> = {
    "Todos": { en: "All Products", pt: "Todos" },
    "Frutas": { en: "Fruits", pt: "Frutas" },
    "Verduras": { en: "Vegetables", pt: "Legumes e Verduras" },
    "Hierbas y Aromáticas": { en: "Herbs & Aromatics", pt: "Ervas e Aromáticas" },
    "Secos y Especias": { en: "Dried Goods & Spices", pt: "Secos e Especiarias" },
    "Otros": { en: "Others", pt: "Outros" }
  };
  return map[category]?.[lang] || category;
}

export const PRODUCT_TRANSLATIONS: Record<string, Record<Language, { name: string; description: string; unit: string; presentation: string }>> = {
  "prod-1": {
    es: {
      name: "Jícama Cristal Mayoreo",
      description: "Jícama de agua dulce y crujiente para ensaladas y botanas de restaurante. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Wholesale Crystal Jicama",
      description: "Sweet and crunchy jicama for restaurant salads and snacks. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Jícama Cristal Atacado",
      description: "Jícama doce e crocante para saladas e petiscos de restaurante. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  },
  "prod-2": {
    es: {
      name: "Limón Persa Sin Semilla",
      description: "Jugo abundante de primera calidad, ideal para barra y cocina. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Seedless Persian Lime",
      description: "Abundant premium juice, ideal for bar and kitchen. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Limão Pérsico Sem Semente",
      description: "Suco abundante de primeira qualidade, ideal para bar e cozinha. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  },
  "prod-3": {
    es: {
      name: "Manzana Fuji Selección",
      description: "Fruta firme, crujiente y dulce para repostería y desayunos. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Select Fuji Apple",
      description: "Firm, crisp, and sweet fruit for pastries and breakfasts. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Maçã Fuji Seleção",
      description: "Fruta firme, crocante e doce para confeitaria e cafés da manhã. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  },
  "prod-4": {
    es: {
      name: "Aguacate Hass Extra Uruapan",
      description: "Cremoso, maduración controlada para guacamoles y platillos estelar. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Extra Hass Avocado Uruapan",
      description: "Creamy, controlled ripening for guacamole and flagship dishes. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Abacate Hass Extra Uruapan",
      description: "Cremoso, maturação controlada para guacamoles e pratos principais. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  },
  "prod-5": {
    es: {
      name: "Piña Miel Crate Extra",
      description: "Dulzura superior para postres, coctelería y barra de bebidas. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Honey Pineapple Extra",
      description: "Superior sweetness for desserts, cocktails, and juice bars. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Abacaxi Mel Extra",
      description: "Dozura superior para sobremesas, coquetéis e bar de bebidas. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  },
  "prod-6": {
    es: {
      name: "Plátano Tabasco Calibre R1",
      description: "Plátano de primera para licuados, licorería y cocina tradicional. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Tabasco Banana Caliber R1",
      description: "Top grade banana for smoothies, bar drinks, and kitchen recipes. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Banana Tabasco Calibre R1",
      description: "Banana de primeira para vitaminas, coquetéis e cozinha tradicional. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  },
  "prod-7": {
    es: {
      name: "Jitomate Saladette Invernadero",
      description: "Jitomate maduro, rojo intenso para salsas, guisados y picados. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Greenhouse Saladette Tomato",
      description: "Ripe, deep red tomato for sauces, stews, and toppings. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Tomate Saladette Estufa",
      description: "Tomate maduro, vermelho intenso para molhos, ensopados e picados. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  },
  "prod-8": {
    es: {
      name: "Cebolla Blanca Mayoreo",
      description: "Cebolla limpia para alto rendimiento en cocina. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Wholesale White Onion",
      description: "Cleaned white onion for high yield kitchen prep. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Cebola Branca Atacado",
      description: "Cebola limpa para alto rendimento na cozinha. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  },
  "prod-9": {
    es: {
      name: "Papa Blanca Alfa Mayoreo",
      description: "Excelente para freír o cocer. Gran consistencia para cocina restaurante. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Wholesale Alfa White Potato",
      description: "Excellent for frying or boiling. Great consistency for commercial kitchens. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Batata Branca Alfa Atacado",
      description: "Excelente para fritar ou cozinhar. Grande consistência para restaurantes. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  },
  "prod-10": {
    es: {
      name: "Zanahoria Lavada Mediana",
      description: "Ideal para caldos, ensaladas y guarniciones. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Medium Washed Carrot",
      description: "Ideal for soups, salads, and side dishes. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Cenoura Lavada Média",
      description: "Ideal para caldos, saladas e acompanhamentos. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  },
  "prod-11": {
    es: {
      name: "Chile Serrano Selección",
      description: "Picoso y fresco para salsas verdes y mexicanas. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Select Serrano Pepper",
      description: "Spicy and fresh for green and Mexican salsas. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Pimenta Serrano Seleção",
      description: "Picante e fresca para molhos verdes e mexicanos. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  },
  "prod-12": {
    es: {
      name: "Cilantro Fresco Mayoreo",
      description: "Hierba fresca de tallo tierno, aroma intenso. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Wholesale Fresh Cilantro",
      description: "Fresh herb with tender stems, intense aroma. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Coentro Fresco Atacado",
      description: "Erva fresca de talo tenro, aroma intenso. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  },
  "prod-13": {
    es: {
      name: "Perejil Liso Gourmet",
      description: "Hojas verdes seleccionadas para marinados y montados. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Gourmet Flat Parsley",
      description: "Selected green leaves for marinades and garnishes. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Salsa Lisa Gourmet",
      description: "Folhas verdes selecionadas para marinadas e guarnições. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  },
  "prod-14": {
    es: {
      name: "Albahaca Fresca Hidropónica",
      description: "Aroma penetrante para pastas, pestos y cocina italiana. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Hydroponic Fresh Basil",
      description: "Penetrating aroma for pasta, pesto, and Italian cuisine. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Manjericão Fresco Hidropônico",
      description: "Aroma marcante para massas, pestos e culinária italiana. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  },
  "prod-15": {
    es: {
      name: "Chile Ancho Seco Primera",
      description: "Chile seco flexible de gran aroma para adobos y moles. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Premium Dried Ancho Chili",
      description: "Pliable dried chili with rich aroma for adobos and moles. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Pimenta Ancho Seca Primeira",
      description: "Pimenta seca flexível de grande aroma para adobos e moles. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  },
  "prod-16": {
    es: {
      name: "Chile Guajillo Seco",
      description: "Color rojo intenso y sabor equilibrado para consomés. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Dried Guajillo Chili",
      description: "Intense red color and balanced flavor for broths and sauces. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Pimenta Guajillo Seca",
      description: "Cor vermelha intensa e sabor equilibrado para caldos. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  },
  "prod-17": {
    es: {
      name: "Ajo Blanco Importado",
      description: "Dientes grandes de fácil pelado para fondo de cocina. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Imported White Garlic",
      description: "Large cloves, easy to peel for kitchen stock. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Alho Branco Importado",
      description: "Dentes grandes de fácil descasque para base de cozinha. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  },
  "prod-18": {
    es: {
      name: "Aceite Vegetal Bidón Industrial",
      description: "Alto punto de humo para freidoras y cocina continua. Venta desde 1 L.",
      unit: "1 L",
      presentation: "1 L (Desde 1 L)"
    },
    en: {
      name: "Industrial Vegetable Oil Jug",
      description: "High smoke point for fryers and continuous cooking. Sold starting from 1 L.",
      unit: "1 L",
      presentation: "1 L (From 1 L)"
    },
    pt: {
      name: "Óleo Vegetal Garrafão Industrial",
      description: "Alto ponto de fumaça para fritadeiras e uso contínuo. Venda a partir de 1 L.",
      unit: "1 L",
      presentation: "1 L (A partir de 1 L)"
    }
  },
  "prod-19": {
    es: {
      name: "Sal de Mar Grano Fino",
      description: "Sazonador natural puro para consumo restaurante. Venta por kilo desde 1 Kg.",
      unit: "1 Kg",
      presentation: "1 Kg (Desde 1 Kg)"
    },
    en: {
      name: "Fine Grain Sea Salt",
      description: "Pure natural seasoning for restaurant consumption. Sold by weight starting from 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (From 1 kg)"
    },
    pt: {
      name: "Sal Marinho Grão Fino",
      description: "Tempero natural puro para consumo de restaurante. Venda por quilo a partir de 1 kg.",
      unit: "1 kg",
      presentation: "1 kg (A partir de 1 kg)"
    }
  }
};

export function getLocalizedProduct(
  product: { id: string; name: string; description: string; unit: string; presentation?: string },
  lang: Language = "es"
): { name: string; description: string; unit: string; presentation: string } {
  if (lang === "es") {
    return {
      name: product.name,
      description: product.description,
      unit: product.unit,
      presentation: product.presentation || product.unit
    };
  }

  const found = PRODUCT_TRANSLATIONS[product.id]?.[lang] || PRODUCT_TRANSLATIONS[product.name]?.[lang];
  if (found) {
    return found;
  }

  // Fallback translation helper for custom items
  if (lang === "en") {
    let unitTrans = product.unit;
    if (unitTrans.toLowerCase().includes("kg") || unitTrans.toLowerCase().includes("kilo")) unitTrans = "1 kg";
    if (unitTrans.toLowerCase().includes("caja")) unitTrans = unitTrans.replace(/caja/i, "Box");
    if (unitTrans.toLowerCase().includes("bulto")) unitTrans = unitTrans.replace(/bulto/i, "Bag");

    let presTrans = product.presentation || unitTrans;
    if (presTrans.includes("Desde 1 Kg")) presTrans = presTrans.replace("Desde 1 Kg", "From 1 kg");

    return {
      name: product.name,
      description: product.description,
      unit: unitTrans,
      presentation: presTrans
    };
  }

  return {
    name: product.name,
    description: product.description,
    unit: product.unit,
    presentation: product.presentation || product.unit
  };
}

export const STORE_TRANSLATIONS: Record<Language, {
  storeTitle: string;
  b2bTitle: string;
  b2bSubtitle: string;
  badgeWarehouse: string;
  badgeKilosFrom1: string;
  badgeDeliveryTime: string;
  legalNoticeButton: string;
  adminPanelButton: string;
  searchPlaceholder: string;
  allCategories: string;
  viewAll: string;
  loadSampleOrder: string;
  colProduct: string;
  colCategory: string;
  colPrice: string;
  colQty: string;
  colSubtotal: string;
  perUnit: string;
  subtotalLabel: string;
  viewCartButton: string;
  cartTitle: string;
  clearCart: string;
  emptyCartTitle: string;
  emptyCartDesc: string;
  shippingHeader: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  addressLabel: string;
  addressPlaceholder: string;
  municipalityLabel: string;
  municipalityPlaceholder: string;
  deliveryDateLabel: string;
  deliveryDateNotice: string;
  referencesLabel: string;
  referencesPlaceholder: string;
  payCardButton: string;
  sendWhatsappButton: string;
  summaryTitle: string;
  totalToPay: string;
  itemsLabel: string;
  payModalTitle: string;
  sandboxNotice: string;
  cardHolderLabel: string;
  cardNumberLabel: string;
  cardExpLabel: string;
  cardCvvLabel: string;
  fillTestCard: string;
  payNowButton: string;
  processingPayment: string;
  paymentSuccessTitle: string;
  paymentSuccessDesc: string;
  folioLabel: string;
  scheduledDeliveryLabel: string;
  deliveryAddressLabel: string;
  downloadReceipt: string;
  backToStore: string;
  currencyTag: string;
  completeRequiredFields: string;
  noProductsFound: string;
  noProductsDesc: string;
  priceLabel: string;
  quantityLabel: string;
  itemSelected: string;
  itemsSelected: string;
  bannerText: string;
  topBannerBadge: string;
  topBannerTitle: string;
  topBannerSubtitle: string;
  topBannerCta: string;
}> = {
  es: {
    storeTitle: "Tienda Online B2B",
    b2bTitle: "LISTA DE PEDIDOS B2B - BODEGA CENTRAL GDL",
    b2bSubtitle: "Suministro masivo e individual para restaurantes y comedores. Puedes marcar tus pedidos por kilos desde 1 Kg y programar tu entrega con mínimo 24 hrs de anticipación.",
    badgeWarehouse: "Bodega Central Guadalajara",
    badgeKilosFrom1: "Pedidos por Kilos desde 1 Kg",
    badgeDeliveryTime: "Entregas programadas 24+ hrs",
    legalNoticeButton: "Aviso de Privacidad y Términos",
    adminPanelButton: "Panel Admin",
    searchPlaceholder: "Buscar fruta, verdura o insumo...",
    allCategories: "Todos",
    viewAll: "Ver Todos",
    loadSampleOrder: "Cargar Pedido de Ejemplo",
    colProduct: "Producto e Insumo / Presentación",
    colCategory: "Categoría",
    colPrice: "Precio",
    colQty: "Cantidad (Kilos desde 1)",
    colSubtotal: "Subtotal",
    perUnit: "por",
    subtotalLabel: "Subtotal:",
    viewCartButton: "Ver Pedido",
    cartTitle: "Tu Pedido B2B",
    clearCart: "Vaciar Carrito",
    emptyCartTitle: "Tu carrito está vacío",
    emptyCartDesc: "Agrega productos desde la lista para continuar.",
    shippingHeader: "Información de Entrega (Restaurante / Negocio)",
    fullNameLabel: "Nombre Completo / Razón Social *",
    fullNamePlaceholder: "ej. Restaurante El Portón",
    phoneLabel: "Teléfono / WhatsApp *",
    phonePlaceholder: "33 1234 5678",
    addressLabel: "Dirección de Entrega (Calle, Número, Colonia) *",
    addressPlaceholder: "ej. Av. Juárez 456, Col. Centro",
    municipalityLabel: "Municipio y Código Postal *",
    municipalityPlaceholder: "ej. Guadalajara, CP 44100",
    deliveryDateLabel: "Fecha de Entrega Deseada (Min. 24 hrs anticipación) *",
    deliveryDateNotice: "Las entregas se programan desde Bodega Central GDL con mínimo 24 hrs de margen.",
    referencesLabel: "Referencias o Notas de Entrega (Opcional)",
    referencesPlaceholder: "ej. Recibir por portón trasero de cocina de 8:00 a 11:00 am",
    payCardButton: "Finalizar y Confirmar Pedido",
    sendWhatsappButton: "Enviar Pedido por WhatsApp",
    summaryTitle: "Resumen de Compra",
    totalToPay: "Total a Pagar",
    itemsLabel: "productos",
    payModalTitle: "Finalizar Pedido B2B",
    sandboxNotice: "Proceso Directo",
    cardHolderLabel: "Titular de la Cuenta",
    cardNumberLabel: "Número de Referencia",
    cardExpLabel: "Expiración",
    cardCvvLabel: "Código",
    fillTestCard: "Llenar datos de prueba",
    payNowButton: "Confirmar Pedido",
    processingPayment: "Procesando pedido...",
    paymentSuccessTitle: "¡Pago Realizado con Éxito!",
    paymentSuccessDesc: "Tu pedido ha sido procesado correctamente y ha sido programado en Bodega Central GDL.",
    folioLabel: "Número de Folio / Comprobante",
    scheduledDeliveryLabel: "Fecha de Entrega Programada",
    deliveryAddressLabel: "Dirección de Entrega",
    downloadReceipt: "Descargar Comprobante PDF",
    backToStore: "Volver a la Tienda",
    completeRequiredFields: "Por favor completa los datos de envío y la fecha de entrega obligatorios (*).",
    noProductsFound: "No se encontraron productos en esta categoría",
    noProductsDesc: "Intenta seleccionando otra pestaña o limpiando tu búsqueda.",
    priceLabel: "Precio",
    quantityLabel: "Kilos (desde 1)",
    itemSelected: "insumo seleccionado",
    itemsSelected: "insumos seleccionados",
    currencyTag: "MXN ($ Pesos Mexicanos)",
    bannerText: "🍎 BODEGA CENTRAL GDL • Pedidos Mayoreo y Kilos desde 1 Kg para Restaurantes y Comedores • Entrega 24+ Hrs • Facturación Disponible",
    topBannerBadge: "¡NUEVO! TIENDA EN LÍNEA FRUTI GO",
    topBannerTitle: "¡MERCADO Y TIENDA EN LÍNEA FRUTI GO!",
    topBannerSubtitle: "Haz clic aquí para ordenar frutas y verduras 100% frescas del campo a tu hogar o restaurante con envío rápido.",
    topBannerCta: "ENTRAR A LA TIENDA Y COMPRAR 🍉"
  },
  en: {
    storeTitle: "B2B Online Store",
    b2bTitle: "B2B ORDER LIST - GDL CENTRAL WAREHOUSE",
    b2bSubtitle: "Wholesale and individual supply for restaurants and dining venues. Order by kilograms starting from 1 kg with delivery scheduled at least 24 hours in advance.",
    badgeWarehouse: "Guadalajara Central Warehouse",
    badgeKilosFrom1: "Kilogram Orders from 1 kg",
    badgeDeliveryTime: "Scheduled Deliveries 24+ hrs",
    legalNoticeButton: "Privacy Notice & Terms",
    adminPanelButton: "Admin Panel",
    searchPlaceholder: "Search fruits, vegetables, supplies...",
    allCategories: "All Products",
    viewAll: "View All",
    loadSampleOrder: "Load Sample Order",
    colProduct: "Product & Supply / Presentation",
    colCategory: "Category",
    colPrice: "Price ($ USD)",
    colQty: "Quantity (Kg from 1)",
    colSubtotal: "Subtotal ($ USD)",
    perUnit: "per",
    subtotalLabel: "Subtotal:",
    viewCartButton: "View Order",
    cartTitle: "Your B2B Order",
    clearCart: "Clear Cart",
    emptyCartTitle: "Your cart is empty",
    emptyCartDesc: "Add products from the catalog to continue.",
    shippingHeader: "Delivery Information (Restaurant / Business)",
    fullNameLabel: "Full Name / Business Name *",
    fullNamePlaceholder: "e.g. The Grand Bistro",
    phoneLabel: "Phone / WhatsApp *",
    phonePlaceholder: "+1 33 1234 5678",
    addressLabel: "Delivery Address (Street, Number, Area) *",
    addressPlaceholder: "e.g. 456 Juarez Ave, Downtown",
    municipalityLabel: "City & Zip Code *",
    municipalityPlaceholder: "e.g. Guadalajara, ZIP 44100",
    deliveryDateLabel: "Desired Delivery Date (Min. 24 hrs in advance) *",
    deliveryDateNotice: "Deliveries are scheduled from GDL Central Warehouse with at least 24 hrs notice.",
    referencesLabel: "Delivery References or Notes (Optional)",
    referencesPlaceholder: "e.g. Receive at rear kitchen door between 8:00 and 11:00 am",
    payCardButton: "Pay with Card (OpenPay Sandbox)",
    sendWhatsappButton: "Send Order via WhatsApp",
    summaryTitle: "Purchase Summary",
    totalToPay: "Total Amount",
    itemsLabel: "items",
    payModalTitle: "Secure Card Payment",
    sandboxNotice: "Sandbox Test Mode active. No real charges will be made to your card.",
    cardHolderLabel: "Cardholder Name",
    cardNumberLabel: "Card Number",
    cardExpLabel: "Expiration (MM/YY)",
    cardCvvLabel: "CVV",
    fillTestCard: "Fill with test card",
    payNowButton: "Pay Now",
    processingPayment: "Processing secure payment...",
    paymentSuccessTitle: "Payment Completed Successfully!",
    paymentSuccessDesc: "Your order has been processed correctly and scheduled at GDL Central Warehouse.",
    folioLabel: "Order / Receipt Folio",
    scheduledDeliveryLabel: "Scheduled Delivery Date",
    deliveryAddressLabel: "Delivery Address",
    downloadReceipt: "Download PDF Receipt",
    backToStore: "Return to Store",
    currencyTag: "USD ($ US Dollars)",
    completeRequiredFields: "Please complete all required shipping fields and delivery date (*).",
    noProductsFound: "No products found in this category",
    noProductsDesc: "Try selecting another tab or clearing your search query.",
    priceLabel: "Price",
    quantityLabel: "Kilograms (from 1)",
    itemSelected: "item selected",
    itemsSelected: "items selected",
    bannerText: "🍎 GDL CENTRAL WAREHOUSE • Wholesale & Kilogram Orders from 1 kg for Restaurants & Venues • 24+ Hr Delivery • Invoicing Available",
    topBannerBadge: "NEW! FRUTI GO ONLINE STORE",
    topBannerTitle: "FRUTI GO ONLINE MARKET & STORE!",
    topBannerSubtitle: "Click here to order 100% fresh fruits and vegetables from farm to your door or restaurant with fast delivery.",
    topBannerCta: "ENTER STORE & SHOP NOW 🍉"
  },
  pt: {
    storeTitle: "Loja Online B2B",
    b2bTitle: "LISTA DE PEDIDOS B2B - ARMAZÉM CENTRAL GDL",
    b2bSubtitle: "Abastecimento para restaurantes e refeitórios. Faça seus pedidos por quilos a partir de 1 kg com entrega agendada com no mínimo 24 horas de antecedência.",
    badgeWarehouse: "Armazém Central Guadalajara",
    badgeKilosFrom1: "Pedidos por Quilo a partir de 1 kg",
    badgeDeliveryTime: "Entregas agendadas 24+ hrs",
    legalNoticeButton: "Aviso de Privacidade e Termos",
    adminPanelButton: "Painel Admin",
    searchPlaceholder: "Buscar frutas, legumes, insumos...",
    allCategories: "Todos",
    viewAll: "Ver Todos",
    loadSampleOrder: "Carregar Pedido Exemplo",
    colProduct: "Produto & Insumo / Apresentação",
    colCategory: "Categoria",
    colPrice: "Preço ($ USD)",
    colQty: "Quantidade (Kg a partir de 1)",
    colSubtotal: "Subtotal ($ USD)",
    perUnit: "por",
    subtotalLabel: "Subtotal:",
    viewCartButton: "Ver Pedido",
    cartTitle: "Seu Pedido B2B",
    clearCart: "Esvaziar Carrinho",
    emptyCartTitle: "Seu carrinho está vazio",
    emptyCartDesc: "Adicione produtos da lista para continuar.",
    shippingHeader: "Informações de Entrega (Restaurante / Empresa)",
    fullNameLabel: "Nome Completo / Razão Social *",
    fullNamePlaceholder: "ex. Restaurante O Portão",
    phoneLabel: "Telefone / WhatsApp *",
    phonePlaceholder: "33 1234 5678",
    addressLabel: "Endereço de Entrega (Rua, Número, Bairro) *",
    addressPlaceholder: "ex. Av. Juárez 456, Centro",
    municipalityLabel: "Cidade e Código Postal *",
    municipalityPlaceholder: "ex. Guadalajara, CP 44100",
    deliveryDateLabel: "Data de Entrega Desejada (Mín. 24 hrs de antecedência) *",
    deliveryDateNotice: "As entregas são agendadas no Armazém Central GDL com antecedência mínima de 24 horas.",
    referencesLabel: "Referências ou Notas de Entrega (Opcional)",
    referencesPlaceholder: "ex. Receber pelo portão dos fundos da cozinha das 8h às 11h",
    payCardButton: "Pagar com Cartão (OpenPay Sandbox)",
    sendWhatsappButton: "Enviar Pedido por WhatsApp",
    summaryTitle: "Resumo da Compra",
    totalToPay: "Total a Pagar",
    itemsLabel: "itens",
    payModalTitle: "Pagamento Seguro com Cartão",
    sandboxNotice: "Modo Sandbox de Teste ativo. Nenhum valor real será cobrado do seu cartão.",
    cardHolderLabel: "Titular do Cartão",
    cardNumberLabel: "Número do Cartão",
    cardExpLabel: "Validade (MM/AA)",
    cardCvvLabel: "CVV",
    fillTestCard: "Preencher com cartão de teste",
    payNowButton: "Pagar Agora",
    processingPayment: "Processando pagamento seguro...",
    paymentSuccessTitle: "Pagamento Realizado com Sucesso!",
    paymentSuccessDesc: "Seu pedido foi processado corretamente e agendado no Armazém Central GDL.",
    folioLabel: "Número do Pedido / Comprovante",
    scheduledDeliveryLabel: "Data de Entrega Agendada",
    deliveryAddressLabel: "Endereço de Entrega",
    downloadReceipt: "Baixar Comprovante PDF",
    backToStore: "Voltar para a Loja",
    currencyTag: "USD ($ Dólares)",
    completeRequiredFields: "Por favor preencha todos os campos obrigatórios e a data de entrega (*).",
    noProductsFound: "Nenhum produto encontrado nesta categoria",
    noProductsDesc: "Tente selecionar outra aba ou limpar sua busca.",
    priceLabel: "Preço",
    quantityLabel: "Quilos (a partir de 1)",
    itemSelected: "item selecionado",
    itemsSelected: "itens selecionados",
    bannerText: "🍎 ARMAZÉM CENTRAL GDL • Pedidos por Atacado e Quilo a partir de 1 kg • Entrega 24+ Hrs • Faturamento Disponível",
    topBannerBadge: "NOVO! LOJA ONLINE FRUTI GO",
    topBannerTitle: "MERCADO E LOJA ONLINE FRUTI GO!",
    topBannerSubtitle: "Clique aqui para encomendar frutas e legumes 100% frescos do campo para sua casa ou restaurante com entrega rápida.",
    topBannerCta: "ENTRAR NA LOJA E COMPRAR 🍉"
  }
};

