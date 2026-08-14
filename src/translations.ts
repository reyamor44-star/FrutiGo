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
    lastUpdated: "Última actualización: Julio de 2026",
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
      desarrollador: "Sobre el Desarrollador",
      medios: "Medios y Galería",
      nosotros: "Sobre Nosotros",
      soporte: "Soporte",
      cuenta: "Eliminar Cuenta",
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
    lastUpdated: "Last updated: July 2026",
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
      desarrollador: "About Developer",
      medios: "Media & Gallery",
      nosotros: "About Us",
      soporte: "Support",
      cuenta: "Delete Account",
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
    lastUpdated: "Última atualização: Julho de 2026",
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
      desarrollador: "Sobre o Desenvolvedor",
      medios: "Mídia e Galeria",
      nosotros: "Sobre Nós",
      soporte: "Suporte",
      cuenta: "Excluir Conta",
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
      <h1>Políticas de Servicio y Calidad Fruti Go</h1>
      <p>En Fruti Go, bajo la dirección general de nuestro <b>Fundador y CEO, Alberto Reyes Sandoval</b>, nuestra misión es garantizar que recibas los productos más frescos del campo directamente en tu hogar y negocio. Estas políticas rigen nuestra operación y compromiso contigo.</p>
      
      <h2>1. Estándares de Calidad</h2>
      <p>Cada fruta y verdura es seleccionada a mano por expertos. Si algún producto no cumple con tus expectativas de frescura al momento de la entrega, cuentas con nuestra <b>Garantía de Satisfacción Total</b> respaldada por nuestro Fundador y CEO <b>Alberto Reyes Sandoval</b> para un reemplazo inmediato.</p>
      
      <h2>2. Pagos Seguros con Openpay</h2>
      <p>Tu seguridad financiera es primordial. Todas las transacciones con tarjeta de crédito, débito y transferencias dentro de nuestra plataforma son procesadas de manera segura a través de <b>Openpay by BBVA</b>. Esto garantiza que tus datos bancarios nunca sean almacenados en nuestros servidores y estén protegidos por los estándares de seguridad más altos de la industria (PCI DSS).</p>
      
      <h2>3. Política de Entregas</h2>
      <p>Operamos en la zona metropolitana de Guadalajara e inmediaciones. Los pedidos se programan con total transparencia de ruta para asegurar que arriben en condiciones óptimas.</p>
      
      <h2>4. Cancelaciones</h2>
      <p>Debido a que manejamos productos perecederos, las cancelaciones deben realizarse con al menos 2 horas de anticipación a la ventana de entrega programada de forma gratuita.</p>

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
        <p style="font-size: 13px; color: #52525b; margin: 0;"><strong>Dirección y Responsabilidad Operativa:</strong></p>
        <p style="font-size: 14px; font-weight: bold; color: #0D7A3F; margin: 2px 0 0 0;">Alberto Reyes Sandoval</p>
        <p style="font-size: 12px; color: #71717a; margin: 0;">Fundador y CEO de Fruti Go</p>
      </div>
    `,
    terminos: `
      <h1>Términos y Condiciones de Uso</h1>
      <p class="text-xs text-zinc-400 -mt-2 mb-6">Última actualización: Julio de 2026</p>
      
      <p>Bienvenido a Fruti Go. Estos Términos y Condiciones regulan el acceso y uso de la aplicación móvil Fruti Go (en adelante, "la Aplicación"), propiedad de <b>Fruti Go</b> y fundada y dirigida legalmente por su <b>Fundador y CEO, Alberto Reyes Sandoval</b>. Al descargar y utilizar la Aplicación, usted acepta cumplir con estos términos. Si no está de acuerdo, le solicitamos abstenerse de utilizarla.</p>
      
      <h2>1. Uso de la Aplicación</h2>
      <ul>
        <li><b>Requisitos:</b> El usuario debe tener al menos 18 años para utilizar esta aplicación.</li>
        <li><b>Licencia de Uso:</b> Se otorga una licencia limitada, no exclusiva, no transferible y revocable para usar la app con fines de compra de productos frescos, envíos y transporte de mascotas.</li>
        <li><b>Restricciones:</b> Queda prohibido modificar, descompilar, realizar ingeniería inversa o usar la app para fines ilícitos o fraudulentos.</li>
      </ul>
      
      <h2>2. Cuentas de Usuario</h2>
      <p>Para acceder a ciertas funciones (como pedidos, envíos o historial), el usuario deberá registrarse. Es responsabilidad del usuario mantener la confidencialidad de sus credenciales de acceso. La Empresa no se hace responsable por pérdidas derivadas del uso no autorizado de su cuenta.</p>
      
      <h2>3. Propiedad Intelectual</h2>
      <p>Todos los derechos de propiedad intelectual sobre el diseño, código, logos, marcas y contenidos de Fruti Go pertenecen a <b>Fruti Go</b>, bajo la titularidad intelectual y desarrollo de su <b>Fundador y CEO, Alberto Reyes Sandoval</b>. Queda prohibida su reproducción total o parcial sin autorización expresa de conformidad con las leyes vigentes.</p>
      
      <h2>4. Limitación de Responsabilidad</h2>
      <p>La Aplicación se proporciona "tal cual" y "según disponibilidad". La Empresa no garantiza que el servicio sea ininterrumpido o libre de errores. No nos hacemos responsables de daños directos o indirectos derivados del uso o imposibilidad de uso de la app.</p>
      
      <h2>5. Modificaciones</h2>
      <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones se notificarán a través de la app y el uso continuado de la misma constituirá la aceptación de los nuevos términos.</p>

      <h2>6. Condiciones del Módulo de Paquetería y Mensajería</h2>
      <p>Fruti Go actúa exclusivamente como intermediario tecnológico que facilita la conexión entre usuarios y repartidores independientes para el traslado de mercancías. Al utilizar el módulo de paquetería, el usuario acepta:</p>
      <ul>
        <li><b>Declaración de Contenido:</b> El usuario es el único responsable de la veracidad sobre el contenido de los paquetes. Queda estrictamente prohibido el envío de mercancías ilegales, sustancias peligrosas, materiales inflamables, dinero en efectivo, títulos de crédito o cualquier objeto ilícito.</li>
        <li><b>Límites de Responsabilidad:</b> La responsabilidad de Fruti Go se limita a la gestión de la plataforma. No asumimos responsabilidad por daños derivados de un embalaje inadecuado, artículos perecederos no declarados o por la pérdida de artículos no permitidos por estos términos.</li>
        <li><b>Derecho de Inspección:</b> Por razones de seguridad pública, el repartidor independiente se reserva el derecho de solicitar la apertura del paquete para verificar que el contenido no contravenga las leyes vigentes o nuestras políticas de seguridad.</li>
      </ul>

      <h2>7. Políticas de Transporte de Mascotas (Pets)</h2>
      <p>Fruti Go ofrece un servicio de traslado de animales de compañía bajo las siguientes condiciones de seguridad y responsabilidad:</p>
      <ul>
        <li><b>Seguridad y Contención:</b> Es obligatorio que toda mascota sea transportada en una transportadora (kennel) rígida, limpia y segura proporcionada por el usuario. En caso de perros medianos o grandes, es indispensable el uso de correa, pechera de seguridad para vehículo y bozal si el animal muestra signos de nerviosismo o reactividad. El repartidor tiene la facultad de cancelar el servicio si el usuario no cuenta con estos elementos de seguridad.</li>
        <li><b>Higiene y Daños Materiales:</b> El usuario es económicamente responsable por cualquier daño causado por la mascota al interior del vehículo (arañazos, mordeduras, suciedad por excrementos, orina o vómito). En caso de incidentes, el usuario se compromete a cubrir los gastos de limpieza profunda o reparación que el conductor independiente acredite.</li>
        <li><b>Salud y Emergencias:</b> El usuario garantiza que la mascota se encuentra libre de enfermedades infectocontagiosas. Fruti Go no es un servicio de ambulancia veterinaria; ante cualquier emergencia médica preexistente durante el trayecto, el conductor limitará su acción a completar el traslado al destino veterinario indicado por el usuario, deslindando a Fruti Go de cualquier complicación en la salud o deceso del animal derivado del estrés del traslado o condiciones médicas previas.</li>
      </ul>

      <h2>8. Políticas de Garantía, Devolución y Reembolso</h2>
      <ul>
        <li><b>Garantía de Frescura:</b> Dado que comercializamos alimentos altamente perecederos, el usuario cuenta con un límite de <b>24 horas naturales</b> tras recibir su pedido para notificar mercancía errónea o dañada, adjuntando evidencia visual vía WhatsApp al número 3317093598 o al correo de soporte.</li>
        <li><b>Reemplazos y Devoluciones Financieras:</b> Si la reclamación procede, se enviará el reemplazo en un lapso de 24 horas, o bien, se tramitará el reembolso mediante la plataforma segura <b>Openpay</b> de forma automática. El saldo reflejado en la cuenta bancaria del usuario suele tomar un periodo de 3 a 10 días hábiles para tarjetas de crédito y hasta 30 días hábiles para tarjetas de débito, dependiendo por completo de las políticas del banco emisor.</li>
        <li><b>Cancelación de Pedidos:</b> Las cancelaciones de pedidos de la tienda serán sin costo alguno siempre y cuando se soliciten con al menos <b>2 horas de anticipación</b> a la ventana de entrega pactada.</li>
      </ul>

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
        <p style="font-size: 13px; color: #52525b; margin: 0;"><strong>Representación y Firma Legal:</strong></p>
        <p style="font-size: 14px; font-weight: bold; color: #0D7A3F; margin: 2px 0 0 0;">Alberto Reyes Sandoval</p>
        <p style="font-size: 12px; color: #71717a; margin: 0;">Fundador y CEO de Fruti Go</p>
      </div>
    `,
    privacidad: `
      <h1>Aviso de Privacidad Integral</h1>
      <p class="text-xs text-zinc-400 -mt-2 mb-6">Última actualización: Julio de 2026</p>
      
      <h2>1. Responsable de los Datos Personales</h2>
      <p><b>Fruti Go</b>, representada legalmente por su <b>Fundador y CEO, Alberto Reyes Sandoval</b>, con correo de contacto <b>frutigo33@gmail.com</b> y teléfono <b>3317093598</b>, con domicilio físico en <b>San Rafael 2790, Col. El Campanario, CP 45234, Guadalajara, Jalisco, México</b>, es la responsable del tratamiento, uso y protección de sus datos personales, de conformidad con las leyes de protección de datos aplicables en los Estados Unidos Mexicanos (LFPDPPP) y las políticas obligatorias de revisión de Google Play Store.</p>
      
      <p>Nuestra plataforma opera con un modelo de tres perfiles de usuario diferenciados: <b>Clientes (Consumidores)</b>, <b>Repartidores (Socios de Entrega)</b> y <b>Negocios (Establecimientos)</b>.</p>
      
      <h2>2. Datos que Recopilamos</h2>
      <p>Dependiendo de cómo uses Fruti Go, podemos recolectar:</p>
      <ul>
        <li><b>Datos de identificación:</b> Nombre completo.</li>
        <li><b>Datos de contacto:</b> Correo electrónico, número de teléfono y dirección de entrega exacta.</li>
        <li><b>Datos de ubicación (Geolocalización):</b>
          <ul>
            <li><b>Clientes:</b> Ubicación en tiempo real en primer plano (solo mediante autorización expresa en el dispositivo) para fijar el origen/destino del envío o entrega.</li>
            <li><b>Repartidores:</b> Ubicación en <b>SEGUNDO PLANO (Background Location)</b>. Recopilamos datos de localización aun cuando la aplicación está cerrada o no está activa en tu pantalla, únicamente mientras estás en turno de servicio. Esto es indispensable para asignar los pedidos más cercanos a tu ubicación, estimar el tiempo de llegada (ETA) y rastrear entregas en tiempo real. Esta función se apaga inmediatamente al colocarse Fuera de Servicio.</li>
          </ul>
        </li>
        <li><b>Datos de navegación:</b> Información sobre el dispositivo, sistema operativo e historial de uso de la app.</li>
      </ul>

      <h2>3. Datos Bancarios y Transacciones Seguras</h2>
      <p>Los pagos e información de tarjetas se realizan directamente a través de nuestro proveedor de servicios certificado <b>Openpay (by BBVA)</b> mediante protocolos HTTPS, cifrado de alta seguridad AES-256 y cumplimiento PCI-DSS. Fruti Go no guarda, recopila ni procesa tus números o datos bancarios en servidores propios.</p>

      <h2>4. Finalidad del Tratamiento de Datos</h2>
      <p>Sus datos serán utilizados para las siguientes finalidades necesarias:</p>
      <ul>
        <li>Crear y gestionar su cuenta de usuario.</li>
        <li>Procesar, preparar y entregar pedidos realizados a través de la app de forma segura.</li>
        <li>Brindar soporte técnico eficiente y atención al cliente.</li>
        <li>Enviar notificaciones importantes sobre el estado de la app o sus pedidos.</li>
        <li><b>Finalidad secundaria:</b> Enviar promociones, ofertas y cupones universales (puedes cancelar la suscripción en cualquier momento que lo desees).</li>
      </ul>

      <h2>5. Transferencia de Datos</h2>
      <p>No vendemos ni compartimos sus datos personales con terceros, excepto cuando sea estrictamente necesario para la operación de la app (por ejemplo, con servicios seguros de pasarela de pagos, o para asignar la ruta logística a los repartidores) o por requerimiento legal de las autoridades competentes.</p>

      <h2>6. Tratamiento de Datos en el Módulo de Paquetería y Mascotas</h2>
      <p>Con la integración de los servicios de paquetería y traslado de mascotas, Fruti Go tratará los siguientes datos adicionales de forma segura:</p>
      <ul>
        <li><b>Datos de Geolocalización Física:</b> Recolectamos la ubicación exacta y en tiempo real del dispositivo del Cliente en primer plano, y del Repartidor en segundo plano durante la vigencia del servicio. Esto tiene la finalidad de asignar al conductor más cercano, calcular tarifas dinámicas precisas, trazar la ruta de entrega óptima y permitir al usuario el monitoreo del trayecto por motivos de seguridad.</li>
        <li><b>Datos de Contacto de Terceros (Destinatarios):</b> Cuando utilices el servicio de paquetería, nos proporcionarás el nombre completo, número telefónico y dirección física del tercero que recibirá el envío. Al ingresar estos datos, el usuario manifiesta bajo protesta de decir verdad que cuenta con el consentimiento expreso de dicho tercero para compartir su información con Fruti Go para la exclusiva ejecución del servicio.</li>
        <li><b>Finalidad del Tratamiento:</b> Estos datos se procesan con el único fin de completar la logística de recolección y entrega, brindar soporte en tiempo real ante incidentes viales, gestionar el cobro seguro mediante OpenPay y aplicar cupones o promociones universales en la transacción. Fruti Go no comercializa, transfiere ni vende tus rutas ni datos de localización a entidades terceras con fines publicitarios.</li>
      </ul>

      <h2>7. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h2>
      <p>Usted tiene derecho a conocer qué datos tenemos de usted, corregirlos, solicitar su eliminación o negarse a su uso. Para ejercer estos derechos de protección, así como para solicitar la <b>eliminación de su cuenta</b>, puede enviar una solicitud por escrito adjuntando su identificación oficial de titularidad a nuestro correo de soporte: <a href="mailto:frutigo33@gmail.com" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo33@gmail.com</a>, o bien utilizar directamente nuestro portal web de baja automática ingresando a: <a href="/cuenta" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo.com.mx/cuenta</a> o <a href="/legal" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo.com.mx/legal</a>.</p>

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
        <p style="font-size: 13px; color: #52525b; margin: 0;"><strong>Oficial de Privacidad y Titular Legal:</strong></p>
        <p style="font-size: 14px; font-weight: bold; color: #0D7A3F; margin: 2px 0 0 0;">Alberto Reyes Sandoval</p>
        <p style="font-size: 12px; color: #71717a; margin: 0;">Fundador y CEO de Fruti Go</p>
      </div>
    `,
    nosotros: `
      <h1>Sobre Nosotros</h1>
      <p>¡Bienvenidos a Fruti Go!</p>
      
      <p>En Fruti Go, somos apasionados por la frescura, la tecnología y la comodidad. Esta aplicación fue creada y desarrollada bajo la visión de <b>Alberto Reyes Sandoval</b>, Fundador y CEO de Fruti Go, con el objetivo de simplificar la forma en que interactúas con la compra y distribución de frutas, verduras y productos frescos, llevando frescura directo a la palma de tu mano.</p>
      
      <h2>Nuestra Misión</h2>
      <p>Conectar a las personas con soluciones prácticas, eficientes y confiables a través de tecnología intuitiva, garantizando siempre la máxima calidad en el servicio y una atención cercana con el liderazgo directo de nuestro fundador.</p>
      
      <h2>¿Por qué elegir Fruti Go?</h2>
      <ul>
        <li><b>Liderazgo Directo:</b> Fundada y dirigida por <b>Alberto Reyes Sandoval</b> (CEO), impulsando innovación tecnológica constante.</li>
        <li><b>Desarrollo local:</b> Creada con dedicación y enfocada en resolver necesidades reales de nuestros usuarios locales.</li>
        <li><b>Facilidad de uso:</b> Una interfaz limpia y rápida para que hagas lo que necesitas sin complicaciones.</li>
        <li><b>Compromiso:</b> Respaldada por un equipo humano listo para escucharte y mejorar día con día.</li>
      </ul>

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
        <p style="font-size: 13px; color: #52525b; margin: 0;"><strong>Fundador y CEO:</strong></p>
        <p style="font-size: 14px; font-weight: bold; color: #0D7A3F; margin: 2px 0 0 0;">Alberto Reyes Sandoval</p>
        <p style="font-size: 12px; color: #71717a; margin: 0;">Creador, Desarrollador Principal y CEO de Fruti Go</p>
      </div>
    `,
    soporte: `
      <h1>Soporte y Atención al Cliente</h1>
      <p>¿Tienes alguna duda, problema técnico o sugerencia con Fruti Go? Bajo la supervisión de nuestro <b>Fundador y CEO, Alberto Reyes Sandoval</b>, estamos aquí para ayudarte a que tu experiencia sea la mejor.</p>
      
      <div style="background: #f9f9f9; border-left: 5px solid #0D7A3F; padding: 25px; border-radius: 12px; margin: 24px 0; color: #333;">
        <p style="margin-bottom: 12px;"><strong>📧 Correo Electrónico:</strong> <a href="mailto:frutigo33@gmail.com" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo33@gmail.com</a></p>
        <p style="margin-bottom: 12px;"><strong>📞 Teléfono / WhatsApp:</strong> <a href="https://wa.me/523317093598" target="_blank" rel="noopener noreferrer" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">3317093598</a></p>
        <p style="margin-bottom: 0;"><strong>⏰ Horario de atención:</strong> Lunes a Viernes de 09:00 a 18:00 hrs.</p>
      </div>
      
      <h2>Consejo para un soporte más rápido:</h2>
      <p>Al enviarnos un correo, por favor incluye:</p>
      <ol>
        <li>Tu nombre de usuario registrado en la app.</li>
        <li>Una breve descripción del problema y, si es posible, una captura de pantalla.</li>
      </ol>
      Te responderemos en un plazo máximo de <b>24 a 48 horas hábiles</b>.

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
        <p style="font-size: 13px; color: #52525b; margin: 0;"><strong>Supervisión General de Atención:</strong></p>
        <p style="font-size: 14px; font-weight: bold; color: #0D7A3F; margin: 2px 0 0 0;">Alberto Reyes Sandoval</p>
        <p style="font-size: 12px; color: #71717a; margin: 0;">Fundador y CEO de Fruti Go</p>
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
      <h1>Terms and Conditions of Use</h1>
      <p class="text-xs text-zinc-400 -mt-2 mb-6">Last updated: July 2026</p>
      
      <p>Welcome to Fruti Go. These Terms and Conditions govern the access and use of the Fruti Go mobile application (hereinafter, "the Application"), owned by <b>Fruti Go</b> (hereinafter, "the Company"). By downloading and using the Application, you agree to comply with these terms. If you do not agree, please refrain from using it.</p>
      
      <h2>1. Application Use</h2>
      <ul>
        <li><b>Requirements:</b> Users must be at least 18 years old to use this application.</li>
        <li><b>License of Use:</b> A limited, non-exclusive, non-transferable, and revocable license is granted to use the app for purchasing fresh products, shipping, and pet transportation.</li>
        <li><b>Restrictions:</b> Modifying, decompiling, reverse engineering, or using the app for unlawful or fraudulent purposes is strictly prohibited.</li>
      </ul>
      
      <h2>2. User Accounts</h2>
      <p>To access certain functions (such as orders, shipping, or order history), users must register. Users are responsible for maintaining the confidentiality of their login credentials. The Company is not responsible for losses resulting from unauthorized use of your account.</p>
      
      <h2>3. Intellectual Property</h2>
      <p>All intellectual property rights regarding the design, code, logos, trademarks, and content of Fruti Go belong to <b>Fruti Go</b>. Total or partial reproduction without express authorization in accordance with applicable laws is prohibited.</p>
      
      <h2>4. Limitation of Liability</h2>
      <p>The Application is provided "as is" and "as available". The Company does not guarantee that the service will be uninterrupted or error-free. We are not liable for direct or indirect damages arising from the use or inability to use the app.</p>
      
      <h2>5. Modifications</h2>
      <p>We reserve the right to modify these terms at any time. Modifications will be notified through the app and continued use will constitute acceptance of the new terms.</p>

      <h2>6. Courier and Messenger Module Conditions</h2>
      <p>Fruti Go acts exclusively as a technology intermediary connecting users with independent couriers for goods transportation. By using the courier module, the user agrees to:</p>
      <ul>
        <li><b>Content Declaration:</b> The user is solely responsible for the truthfulness of the package content. Shipping illegal goods, hazardous substances, flammable materials, cash, credit instruments, or any illicit objects is strictly prohibited.</li>
        <li><b>Limits of Liability:</b> Fruti Go's liability is limited to platform management. We assume no liability for damage caused by improper packaging, undeclared perishable items, or loss of items prohibited by these terms.</li>
        <li><b>Right of Inspection:</b> For public safety reasons, the independent courier reserves the right to request package opening to verify that contents do not violate applicable laws or our safety policies.</li>
      </ul>

      <h2>7. Pet Transportation Policies (Pets)</h2>
      <p>Fruti Go offers a pet transportation service under the following safety and liability conditions:</p>
      <ul>
        <li><b>Safety and Containment:</b> All pets must be transported in a rigid, clean, and safe carrier (kennel) provided by the user. Medium or large dogs require a leash, vehicle safety harness, and muzzle if nervous or reactive. Couriers reserve the right to cancel service if these safety elements are absent.</li>
        <li><b>Hygiene and Property Damage:</b> The user is financially responsible for any damage caused by the pet inside the vehicle (scratches, bites, dirt from feces, urine, or vomit). In case of incidents, the user agrees to cover deep cleaning or repair expenses certified by the driver.</li>
        <li><b>Health and Emergencies:</b> The user guarantees that the pet is free from contagious diseases. Fruti Go is not a veterinary ambulance service; in the event of a pre-existing medical emergency during transit, the driver will complete transit to the user's specified veterinary destination, relieving Fruti Go of any liability for health complications or death resulting from stress or pre-existing conditions.</li>
      </ul>

      <h2>8. Warranty, Return, and Refund Policies</h2>
      <ul>
        <li><b>Freshness Warranty:</b> As we market highly perishable food, the user has a limit of <b>24 natural hours</b> after receiving their order to report wrong or damaged goods, attaching visual evidence via WhatsApp to 3317093598 or to support email.</li>
        <li><b>Replacements and Financial Refunds:</b> If the claim is valid, a replacement will be sent within 24 hours, or a refund will be processed automatically via the secure <b>Openpay</b> platform. Balances reflected in user bank accounts usually take 3 to 10 business days for credit cards and up to 30 business days for debit cards, depending on the issuing bank.</li>
        <li><b>Order Cancellations:</b> Store order cancellations are free of charge as long as requested at least <b>2 hours prior</b> to the agreed delivery window.</li>
      </ul>
    `,
    privacidad: `
      <h1>Comprehensive Privacy Notice</h1>
      <p class="text-xs text-zinc-400 -mt-2 mb-6">Last updated: July 2026</p>
      
      <h2>1. Personal Data Controller</h2>
      <p><b>Fruti Go</b> (the Company), contact email <b>frutigo33@gmail.com</b> and phone <b>3317093598</b>, address at <b>San Rafael 2790, Col. El Campanario, CP 45234, Guadalajara, Jalisco, Mexico</b>, is responsible for processing, using, and protecting your personal data in accordance with Mexican data protection laws (LFPDPPP) and Google Play Store mandatory review policies.</p>
      
      <p>Our platform operates with three distinct user profiles: <b>Clients (Consumers)</b>, <b>Drivers (Delivery Partners)</b>, and <b>Businesses (Establishments)</b>.</p>
      
      <h2>2. Data We Collect</h2>
      <p>Depending on how you use Fruti Go, we may collect:</p>
      <ul>
        <li><b>Identification data:</b> Full name.</li>
        <li><b>Contact data:</b> Email address, phone number, and exact delivery address.</li>
        <li><b>Location data (Geolocation):</b>
          <ul>
            <li><b>Clients:</b> Real-time foreground location (only via explicit authorization on the device) to set delivery origin/destination.</li>
            <li><b>Drivers:</b> <b>BACKGROUND LOCATION</b>. We collect location data even when the app is closed or inactive on screen, only while on active service duty. This is essential to assign nearest orders, estimate arrival times (ETA), and track deliveries in real time. Turns off immediately when going off duty.</li>
          </ul>
        </li>
        <li><b>Browsing data:</b> Device info, operating system, and app usage history.</li>
      </ul>

      <h2>3. Banking Data and Secure Transactions</h2>
      <p>Payments and card details are handled directly through our certified service provider <b>Openpay (by BBVA)</b> using HTTPS protocols, AES-256 encryption, and PCI-DSS compliance. Fruti Go does not store, collect, or process bank card numbers on its own servers.</p>

      <h2>4. Purpose of Data Processing</h2>
      <p>Your data will be used for the following necessary purposes:</p>
      <ul>
        <li>Create and manage your user account.</li>
        <li>Process, prepare, and deliver orders securely through the app.</li>
        <li>Provide efficient technical support and customer care.</li>
        <li>Send important notifications regarding app status or your orders.</li>
        <li><b>Secondary purpose:</b> Send promotions, offers, and universal coupons (you can unsubscribe anytime).</li>
      </ul>

      <h2>5. Data Transfer</h2>
      <p>We do not sell or share your personal data with third parties, except when strictly necessary for app operation (e.g., secure payment gateways or logistics route assignment) or legal requirements from competent authorities.</p>

      <h2>6. Data Processing in Courier and Pet Module</h2>
      <p>With package delivery and pet transport integration, Fruti Go securely processes these additional data:</p>
      <ul>
        <li><b>Physical Geolocation Data:</b> Exact real-time location of Client device in foreground, and Driver in background during service. Purpose: assign nearest driver, calculate dynamic rates, plot optimal route, and allow safety tracking.</li>
        <li><b>Third-Party Contact Data (Recipients):</b> When using courier service, you provide full name, phone number, and address of recipient. User warrants express consent from recipient.</li>
        <li><b>Purpose of Processing:</b> Solely to complete collection and delivery logistics, provide real-time support, manage secure billing via OpenPay, and apply coupons. Fruti Go does not sell routes or location data for advertising.</li>
      </ul>

      <h2>7. ARCO Rights (Access, Rectification, Cancellation, Objection)</h2>
      <p>You have the right to know what data we hold, correct it, request deletion, or refuse its use. To exercise these rights or request <b>account deletion</b>, send a written request with official ID to support email: <a href="mailto:frutigo33@gmail.com" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo33@gmail.com</a>, or use our automatic deletion portal at: <a href="/cuenta" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo.com.mx/cuenta</a> or <a href="/legal" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo.com.mx/legal</a>.</p>
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
      <h1>Termos e Condições de Uso</h1>
      <p class="text-xs text-zinc-400 -mt-2 mb-6">Última atualização: Julho de 2026</p>
      
      <p>Bem-vindo ao Fruti Go. Estes Termos e Condições regulam o acesso e uso do aplicativo móvel Fruti Go (adiante "o Aplicativo"), de propriedade da <b>Fruti Go</b> (adiante "a Empresa"). Ao baixar e utilizar o Aplicativo, você concorda com estes termos. Se não concordar, solicitamos que se abstenha de utilizá-lo.</p>
      
      <h2>1. Uso do Aplicativo</h2>
      <ul>
        <li><b>Requisitos:</b> O usuário deve ter pelo menos 18 anos para utilizar este aplicativo.</li>
        <li><b>Licença de Uso:</b> Concede-se uma licença limitada, não exclusiva, não transferível e revogável para usar o app para compra de produtos frescos, entregas e transporte de animais de estimação.</li>
        <li><b>Restrições:</b> É proibido modificar, descompilar, fazer engenharia reversa ou utilizar o app para fins ilícitos ou fraudulentos.</li>
      </ul>
      
      <h2>2. Contas de Usuário</h2>
      <p>Para acessar determinadas funções (como pedidos, entregas ou histórico), o usuário deverá se cadastrar. É responsabilidade do usuário manter o sigilo de suas credenciais de acesso. A Empresa não se responsabiliza por perdas decorrentes do uso não autorizado de sua conta.</p>
      
      <h2>3. Propriedade Intelectual</h2>
      <p>Todos os direitos de propriedade intelectual sobre o design, código, logotipos, marcas e conteúdos do Fruti Go pertencem ao <b>Fruti Go</b>. É proibida sua reprodução total ou parcial sem autorização expressa em conformidade com as leis vigentes.</p>
      
      <h2>4. Limitação de Responsabilidade</h2>
      <p>O Aplicativo é fornecido "como está" e "conforme disponível". A Empresa não garante que o serviço seja ininterrupto ou livre de erros. Não nos responsabilizamos por danos diretos ou indiretos decorrentes do uso ou da impossibilidade de uso do aplicativo.</p>
      
      <h2>5. Modificações</h2>
      <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. As modificações serão notificadas através do app e o uso continuado constituirá aceitação dos novos termos.</p>

      <h2>6. Condições do Módulo de Encomendas e Entregas</h2>
      <p>O Fruti Go atua exclusivamente como intermediário tecnológico que facilita a conexão entre usuários e entregadores independentes para o transporte de mercadorias. Ao utilizar o módulo de encomendas, o usuário aceita:</p>
      <ul>
        <li><b>Declaração de Conteúdo:</b> O usuário é o único responsável pela veracidade do conteúdo dos pacotes. É estritamente proibido o envio de mercadorias ilegais, substâncias perigosas, materiais inflamáveis, dinheiro em espécie, títulos de crédito ou qualquer objeto ilícito.</li>
        <li><b>Limites de Responsabilidade:</b> A responsabilidade do Fruti Go limita-se à gestão da plataforma. Não assumimos responsabilidade por danos decorrentes de embalagem inadequada, itens perecíveis não declarados ou perda de itens proibidos por estes termos.</li>
        <li><b>Direito de Inspeção:</b> Por razões de segurança pública, o entregador independente reserva-se o direito de solicitar a abertura do pacote para verificar se o conteúdo não contraria as leis vigentes ou nossas políticas de segurança.</li>
      </ul>

      <h2>7. Políticas de Transporte de Animais de Estimação (Pets)</h2>
      <p>O Fruti Go oferece um serviço de transporte de animais de companhia sob as seguintes condições de segurança e responsabilidade:</p>
      <ul>
        <li><b>Segurança e Contenção:</b> É obrigatório que todo animal seja transportado em uma caixa de transporte (kennel) rígida, limpa e segura fornecida pelo usuário. Para cães de médio ou grande porte, é indispensável o uso de guia, cinto de segurança veicular e focinheira se o animal demonstrar nervosismo ou reatividade. O entregador pode cancelar o serviço caso o usuário não possua estes itens de segurança.</li>
        <li><b>Higiene e Danos Materiais:</b> O usuário é financeiramente responsável por qualquer dano causado pelo animal no interior do veículo (arranhões, mordidas, sujeira por fezes, urina ou vômito). Em caso de incidentes, o usuário concorda em cobrir as despesas de limpeza profunda ou reparo comprovadas pelo motorista.</li>
        <li><b>Saúde e Emergências:</b> O usuário garante que o animal está livre de doenças infectocontagiosas. O Fruti Go não é um serviço de ambulância veterinária; diante de qualquer emergência médica pré-existente durante o trajeto, o motorista limitará sua ação a concluir o trajeto até o destino veterinário indicado pelo usuário, isentando o Fruti Go de qualquer complicação na saúde ou óbito do animal decorrente do estresse do transporte ou condições prévias.</li>
      </ul>

      <h2>8. Políticas de Garantia, Devolução e Reembolso</h2>
      <ul>
        <li><b>Garantia de Frescor:</b> Por comercializarmos alimentos altamente perecíveis, o usuário tem o prazo limite de <b>24 horas naturais</b> após receber seu pedido para notificar mercadoria incorreta ou danificada, anexando evidência visual via WhatsApp para 3317093598 ou e-mail de suporte.</li>
        <li><b>Substituições e Reembolsos Financeiros:</b> Se a reclamação for procedente, o reenvio da substituição ocorrerá em até 24 horas, ou o reembolso será processado automaticamente através da plataforma segura <b>Openpay</b>. O saldo refletido na conta bancária do usuário costuma levar de 3 a 10 dias úteis para cartões de crédito e até 30 dias úteis para cartões de débito, dependendo do banco emissor.</li>
        <li><b>Cancelamento de Pedidos:</b> Cancelamentos de pedidos da loja serão isentos de taxas desde que solicitados com pelo menos <b>2 horas de antecedência</b> da janela de entrega combinada.</li>
      </ul>
    `,
    privacidad: `
      <h1>Aviso de Privacidade Integral</h1>
      <p class="text-xs text-zinc-400 -mt-2 mb-6">Última atualização: Julho de 2026</p>
      
      <h2>1. Responsável pelos Dados Pessoais</h2>
      <p><b>Fruti Go</b> (a Empresa), e-mail de contato <b>frutigo33@gmail.com</b> e telefone <b>3317093598</b>, com endereço físico na <b>San Rafael 2790, Col. El Campanario, CP 45234, Guadalajara, Jalisco, México</b>, é a responsável pelo tratamento, uso e proteção dos seus dados pessoais, em conformidade com as leis de proteção de dados (LFPDPPP) e políticas obrigatórias da Google Play Store.</p>
      
      <p>Nossa plataforma opera com três perfis de usuário diferenciados: <b>Clientes (Consumidores)</b>, <b>Entregadores (Parceiros de Entrega)</b> e <b>Negócios (Estabelecimentos)</b>.</p>
      
      <h2>2. Dados que Coletamos</h2>
      <p>Dependendo de como você usa o Fruti Go, podemos coletar:</p>
      <ul>
        <li><b>Dados de identificação:</b> Nome completo.</li>
        <li><b>Dados de contato:</b> E-mail, número de telefone e endereço exato de entrega.</li>
        <li><b>Dados de localização (Geolocalização):</b>
          <ul>
            <li><b>Clientes:</b> Localização em tempo real em primeiro plano (apenas mediante autorização expressa no dispositivo) para definir origem/destino.</li>
            <li><b>Entregadores:</b> Localização em <b>SEGUNDO PLANO (Background Location)</b>. Coletamos dados de localização mesmo quando o aplicativo está fechado ou inativo na tela, unicamente durante o turno de serviço. Isso é indispensável para atribuir pedidos mais próximos, estimar tempo de chegada (ETA) e rastrear entregas em tempo real. Desliga-se imediatamente ao ficar fora de serviço.</li>
          </ul>
        </li>
        <li><b>Dados de navegação:</b> Informações do dispositivo, sistema operacional e histórico de uso do app.</li>
      </ul>

      <h2>3. Dados Bancários e Transações Seguras</h2>
      <p>Os pagamentos e dados de cartão são realizados diretamente através do nosso provedor certificado <b>Openpay (by BBVA)</b> mediante protocolos HTTPS, criptografia AES-256 e conformidade PCI-DSS. O Fruti Go não armazena nem processa números de cartão em servidores próprios.</p>

      <h2>4. Finalidade do Tratamento de Dados</h2>
      <p>Seus dados serão utilizados para as seguintes finalidades necessárias:</p>
      <ul>
        <li>Criar e gerenciar sua conta de usuário.</li>
        <li>Processar, preparar e entregar pedidos com segurança através do aplicativo.</li>
        <li>Oferecer suporte técnico eficiente e atendimento ao cliente.</li>
        <li>Enviar notificações importantes sobre o status do aplicativo ou seus pedidos.</li>
        <li><b>Finalidade secundária:</b> Enviar promoções, ofertas e cupons universais (você pode cancelar a inscrição a qualquer momento).</li>
      </ul>

      <h2>5. Transferência de Dados</h2>
      <p>Não vendemos nem compartilhamos seus dados pessoais com terceiros, exceto quando estritamente necessário para a operação do app (por exemplo, com gateways seguros de pagamento ou atribuição de rotas de logística) ou por exigência legal das autoridades competentes.</p>

      <h2>6. Tratamento de Dados no Módulo de Encomendas e Pets</h2>
      <p>Com a integração dos serviços de entrega de encomendas e transporte de pets, o Fruti Go tratará os seguintes dados adicionais de forma segura:</p>
      <ul>
        <li><b>Dados de Geolocalización Física:</b> Localização exata em tempo real do dispositivo do Cliente em primeiro plano e do Entregador em segundo plano durante o serviço. Finalidade: atribuir o motorista mais próximo, calcular tarifas dinâmicas, traçar rotas e permitir rastreamento de segurança.</li>
        <li><b>Dados de Contato de Terceiros (Destinatários):</b> Ao utilizar o serviço de encomendas, você fornecerá nome completo, telefone e endereço do destinatário. O usuário declara ter autorização prévia do destinatário.</li>
        <li><b>Finalidad do Tratamento:</b> Exclusivamente para concluir a logística de coleta e entrega, oferecer suporte em tempo real, gerenciar cobranças via OpenPay e aplicar cupons. O Fruti Go não comercializa nem vende dados de localização para publicidade.</li>
      </ul>

      <h2>7. Direitos ARCO (Acesso, Retificação, Cancelamento e Oposição)</h2>
      <p>Você tem o direito de saber quais dados temos, corrigi-los, solicitar sua exclusão ou recusar seu uso. Para exercer estes direitos ou solicitar a <b>exclusão da sua conta</b>, envie uma solicitação por escrito com documento oficial para nosso e-mail de suporte: <a href="mailto:frutigo33@gmail.com" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo33@gmail.com</a>, or utilize nosso portal de exclusão automática em: <a href="/cuenta" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo.com.mx/cuenta</a> ou <a href="/legal" style="color: #0D7A3F; font-weight: bold; text-decoration: underline;">frutigo.com.mx/legal</a>.</p>
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

