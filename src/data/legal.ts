import { SupportedLocale } from '../types';

export const LEGAL_UPDATED_AT = '2026-08-12';

export type LegalSection = { title: string; paragraphs: string[] };
export type LegalDocumentType = 'privacy' | 'terms';
export type LegalDocument = { title: string; summary: string; sections: LegalSection[] };

const privacy: Record<SupportedLocale, LegalDocument> = {
  'pt-BR': {
    title: 'Política de Privacidade',
    summary: 'Esta política explica como o PowerCost trata informações no aplicativo e por meio dos anúncios.',
    sections: [
      { title: '1. Responsável e contato', paragraphs: ['O PowerCost é o responsável pelo tratamento descrito nesta política. Para solicitações de privacidade, use o contato de suporte do desenvolvedor exibido na página oficial do aplicativo na loja.'] },
      { title: '2. Dados mantidos no aparelho', paragraphs: ['Cálculos de consumo, histórico, tarifa, idioma, tema e benefícios temporários são armazenados localmente no aparelho. O PowerCost não possui conta de usuário nem envia esse histórico para um servidor próprio.'] },
      { title: '3. Dados usados por anúncios', paragraphs: ['O app usa o Google Mobile Ads SDK. Conforme a configuração, o Google e parceiros podem tratar endereço IP, identificadores do aparelho ou de publicidade, interações com anúncios e com o app, diagnósticos e localização aproximada inferida do IP.', 'Esses dados são tratados segundo as políticas do Google e as escolhas de consentimento disponíveis para a sua região.'] },
      { title: '4. Consentimento e rastreamento', paragraphs: ['Quando exigido, o app apresenta o formulário de consentimento do Google antes de inicializar a medição de anúncios. No iOS, o rastreamento entre apps depende também da permissão App Tracking Transparency. Negar personalização não impede o uso do app.'] },
      { title: '5. Finalidades e compartilhamento', paragraphs: ['Os dados locais servem para calcular, salvar preferências e restaurar o histórico. Dados publicitários podem ser usados pelo Google e seus parceiros para fornecer, limitar, medir, proteger e, quando permitido, personalizar anúncios.'] },
      { title: '6. Retenção e segurança', paragraphs: ['Dados locais permanecem até serem apagados nos Ajustes, removidos individualmente ou eliminados com a desinstalação. O AsyncStorage não deve ser tratado como cofre de informações confidenciais. A retenção de dados publicitários é controlada pelos provedores envolvidos.'] },
      { title: '7. Seus controles', paragraphs: ['Nos Ajustes, você pode limpar o histórico, apagar todos os dados locais e abrir as opções de privacidade dos anúncios. Também pode redefinir ou limitar o identificador de publicidade nas configurações do sistema.'] },
      { title: '8. Crianças', paragraphs: ['O PowerCost é um utilitário de uso geral e não é direcionado a crianças. O aplicativo não deve ser distribuído como produto infantil sem uma configuração específica de público e anúncios compatível com as políticas aplicáveis.'] },
      { title: '9. Transferências e alterações', paragraphs: ['Provedores de anúncios podem tratar dados em outros países com as salvaguardas aplicáveis. Esta política pode mudar quando recursos, provedores ou obrigações legais forem alterados; a data da versão será atualizada nesta tela.'] },
    ],
  },
  'en-US': {
    title: 'Privacy Policy',
    summary: 'This policy explains how PowerCost handles information in the app and through advertising.',
    sections: [
      { title: '1. Controller and contact', paragraphs: ['PowerCost is responsible for the processing described here. For privacy requests, use the developer support contact shown on the app’s official store listing.'] },
      { title: '2. Data kept on the device', paragraphs: ['Usage estimates, history, rate, language, theme and temporary benefits are stored locally. PowerCost has no user accounts and does not send this history to its own server.'] },
      { title: '3. Advertising data', paragraphs: ['The app uses the Google Mobile Ads SDK. Depending on configuration, Google and its partners may process IP address, device or advertising identifiers, ad and app interactions, diagnostics, and approximate location inferred from IP.', 'This data is handled under Google policies and the consent choices available in your region.'] },
      { title: '4. Consent and tracking', paragraphs: ['Where required, the Google consent form is shown before ad measurement is initialized. On iOS, cross-app tracking also depends on App Tracking Transparency permission. Refusing personalization does not prevent use of the app.'] },
      { title: '5. Purposes and sharing', paragraphs: ['Local data is used to calculate, save preferences and restore history. Advertising data may be used by Google and its partners to serve, limit, measure, protect and, where permitted, personalize ads.'] },
      { title: '6. Retention and security', paragraphs: ['Local data remains until deleted in Settings, removed individually or erased by uninstalling. AsyncStorage should not be treated as a vault for confidential information. Advertising data retention is controlled by the relevant providers.'] },
      { title: '7. Your controls', paragraphs: ['In Settings you can clear history, delete all local data and open ad privacy options. You can also reset or limit the advertising identifier in system settings.'] },
      { title: '8. Children', paragraphs: ['PowerCost is a general-purpose utility and is not directed to children. It must not be distributed as a child-directed product without audience and ad settings that meet applicable policies.'] },
      { title: '9. Transfers and changes', paragraphs: ['Advertising providers may process data in other countries under applicable safeguards. This policy may change when features, providers or legal requirements change; the version date will be updated here.'] },
    ],
  },
  'es-ES': {
    title: 'Política de Privacidad',
    summary: 'Esta política explica cómo PowerCost trata la información en la aplicación y mediante la publicidad.',
    sections: [
      { title: '1. Responsable y contacto', paragraphs: ['PowerCost es responsable del tratamiento descrito aquí. Para solicitudes de privacidad, usa el contacto de soporte del desarrollador que aparece en la ficha oficial de la tienda.'] },
      { title: '2. Datos guardados en el dispositivo', paragraphs: ['Cálculos, historial, tarifa, idioma, tema y beneficios temporales se guardan localmente. PowerCost no tiene cuentas ni envía este historial a un servidor propio.'] },
      { title: '3. Datos publicitarios', paragraphs: ['La aplicación usa Google Mobile Ads SDK. Según la configuración, Google y sus socios pueden tratar la dirección IP, identificadores del dispositivo o publicitarios, interacciones, diagnósticos y ubicación aproximada inferida de la IP.', 'Estos datos se tratan según las políticas de Google y las opciones de consentimiento disponibles en tu región.'] },
      { title: '4. Consentimiento y seguimiento', paragraphs: ['Cuando se requiere, el formulario de Google se muestra antes de iniciar la medición de anuncios. En iOS, el seguimiento entre aplicaciones también depende del permiso App Tracking Transparency. Rechazar la personalización no impide usar la aplicación.'] },
      { title: '5. Finalidades y terceros', paragraphs: ['Los datos locales permiten calcular, guardar preferencias y restaurar el historial. Google y sus socios pueden usar datos publicitarios para mostrar, limitar, medir, proteger y, cuando se permita, personalizar anuncios.'] },
      { title: '6. Conservación y seguridad', paragraphs: ['Los datos locales permanecen hasta que se borran en Ajustes, se eliminan individualmente o se desinstala la aplicación. AsyncStorage no debe usarse como almacén de información confidencial. Los proveedores controlan la conservación publicitaria.'] },
      { title: '7. Tus controles', paragraphs: ['En Ajustes puedes borrar el historial, eliminar todos los datos locales y abrir las opciones de privacidad de anuncios. También puedes limitar el identificador publicitario desde el sistema.'] },
      { title: '8. Menores', paragraphs: ['PowerCost es una utilidad general y no está dirigida a menores. No debe distribuirse como producto infantil sin configurar público y anuncios conforme a las políticas aplicables.'] },
      { title: '9. Transferencias y cambios', paragraphs: ['Los proveedores pueden tratar datos en otros países con las garantías aplicables. Actualizaremos la fecha de esta política cuando cambien funciones, proveedores u obligaciones.'] },
    ],
  },
  'fr-FR': {
    title: 'Politique de confidentialité',
    summary: 'Cette politique explique comment PowerCost traite les informations dans l’application et via la publicité.',
    sections: [
      { title: '1. Responsable et contact', paragraphs: ['PowerCost est responsable du traitement décrit ici. Pour toute demande, utilisez le contact d’assistance du développeur indiqué sur la fiche officielle de l’application.'] },
      { title: '2. Données conservées sur l’appareil', paragraphs: ['Les calculs, l’historique, le tarif, la langue, le thème et les avantages temporaires sont stockés localement. PowerCost ne crée pas de compte et n’envoie pas cet historique à son propre serveur.'] },
      { title: '3. Données publicitaires', paragraphs: ['L’application utilise Google Mobile Ads SDK. Selon la configuration, Google et ses partenaires peuvent traiter l’adresse IP, des identifiants d’appareil ou publicitaires, les interactions, les diagnostics et une position approximative déduite de l’IP.', 'Ces données sont traitées selon les règles de Google et vos choix de consentement régionaux.'] },
      { title: '4. Consentement et suivi', paragraphs: ['Lorsque requis, le formulaire Google est présenté avant l’initialisation de la mesure publicitaire. Sur iOS, le suivi entre applications dépend aussi de l’autorisation App Tracking Transparency. Refuser la personnalisation n’empêche pas l’utilisation de l’app.'] },
      { title: '5. Finalités et partage', paragraphs: ['Les données locales servent aux calculs, préférences et à l’historique. Google et ses partenaires peuvent utiliser les données publicitaires pour diffuser, limiter, mesurer, sécuriser et, si autorisé, personnaliser les annonces.'] },
      { title: '6. Conservation et sécurité', paragraphs: ['Les données locales restent jusqu’à leur suppression dans les Réglages, leur suppression individuelle ou la désinstallation. AsyncStorage ne doit pas servir de coffre pour des informations confidentielles. Les fournisseurs gèrent la conservation publicitaire.'] },
      { title: '7. Vos contrôles', paragraphs: ['Dans les Réglages, vous pouvez effacer l’historique, supprimer toutes les données locales et ouvrir les options de confidentialité publicitaire. Vous pouvez aussi limiter l’identifiant publicitaire dans le système.'] },
      { title: '8. Enfants', paragraphs: ['PowerCost est un utilitaire général et ne cible pas les enfants. Il ne doit pas être distribué comme produit pour enfants sans réglages d’audience et de publicité conformes.'] },
      { title: '9. Transferts et modifications', paragraphs: ['Les fournisseurs peuvent traiter des données dans d’autres pays avec les garanties applicables. La date de cette politique sera mise à jour lorsque les fonctions, fournisseurs ou obligations changent.'] },
    ],
  },
};

const terms: Record<SupportedLocale, LegalDocument> = {
  'pt-BR': { title: 'Termos de Uso', summary: 'Ao usar o PowerCost, você concorda com estes termos.', sections: [
    { title: '1. Finalidade', paragraphs: ['O PowerCost fornece estimativas educativas de consumo e custo de energia a partir dos dados informados pelo usuário.'] },
    { title: '2. Estimativas e responsabilidade', paragraphs: ['Os resultados não são medição oficial, fatura, auditoria energética nem aconselhamento profissional. Potência real, tarifa, impostos, bandeiras, eficiência e hábitos podem alterar o valor. Confirme decisões relevantes com a concessionária ou profissional qualificado.'] },
    { title: '3. Uso permitido', paragraphs: ['Use o app de forma lícita e não tente interferir, fraudar anúncios, explorar falhas ou redistribuir conteúdo protegido sem autorização. Você é responsável pela exatidão dos dados inseridos.'] },
    { title: '4. Anúncios e recompensas', paragraphs: ['O app pode exibir banners, anúncios nativos, intersticiais, de abertura e premiados. Recompensas são temporárias, não possuem valor monetário e podem ficar indisponíveis por rede, região ou provedor. Anúncios premiados são voluntários.'] },
    { title: '5. Disponibilidade e mudanças', paragraphs: ['O serviço é fornecido no estado disponível. Recursos podem mudar ou ser interrompidos para manutenção, segurança ou conformidade. Estes termos podem ser atualizados e a data da versão será exibida.'] },
    { title: '6. Limitação', paragraphs: ['Na extensão permitida por lei, o responsável não responde por decisões tomadas apenas com base em estimativas, indisponibilidade ou conteúdo de terceiros. Direitos obrigatórios do consumidor permanecem preservados.'] },
    { title: '7. Contato', paragraphs: ['Para questões sobre estes termos, use o contato de suporte do desenvolvedor exibido na página oficial do aplicativo na loja.'] },
  ] },
  'en-US': { title: 'Terms of Use', summary: 'By using PowerCost, you agree to these terms.', sections: [
    { title: '1. Purpose', paragraphs: ['PowerCost provides educational estimates of energy use and cost based on information entered by the user.'] },
    { title: '2. Estimates and responsibility', paragraphs: ['Results are not an official measurement, bill, energy audit or professional advice. Actual power, rates, taxes, efficiency and habits may change the amount. Confirm important decisions with your utility or a qualified professional.'] },
    { title: '3. Permitted use', paragraphs: ['Use the app lawfully and do not interfere with it, commit ad fraud, exploit flaws or redistribute protected content without permission. You are responsible for the accuracy of entered data.'] },
    { title: '4. Ads and rewards', paragraphs: ['The app may display banner, native, interstitial, app-open and rewarded ads. Rewards are temporary, have no monetary value and may be unavailable due to network, region or provider. Rewarded ads are voluntary.'] },
    { title: '5. Availability and changes', paragraphs: ['The service is provided as available. Features may change or stop for maintenance, security or compliance. These terms may be updated and the version date will be shown.'] },
    { title: '6. Limitation', paragraphs: ['To the extent allowed by law, the provider is not liable for decisions based only on estimates, unavailability or third-party content. Mandatory consumer rights remain unaffected.'] },
    { title: '7. Contact', paragraphs: ['For questions about these terms, use the developer support contact on the app’s official store listing.'] },
  ] },
  'es-ES': { title: 'Términos de Uso', summary: 'Al usar PowerCost, aceptas estos términos.', sections: [
    { title: '1. Finalidad', paragraphs: ['PowerCost ofrece estimaciones educativas de consumo y costo basadas en los datos introducidos.'] },
    { title: '2. Estimaciones y responsabilidad', paragraphs: ['Los resultados no son una medición oficial, factura, auditoría ni asesoría profesional. Potencia, tarifas, impuestos, eficiencia y hábitos pueden cambiar el importe. Confirma decisiones importantes con tu compañía o un profesional.'] },
    { title: '3. Uso permitido', paragraphs: ['Usa la aplicación legalmente y no interfieras, defraudes anuncios, explotes fallos ni redistribuyas contenido protegido. Eres responsable de los datos introducidos.'] },
    { title: '4. Anuncios y recompensas', paragraphs: ['La aplicación puede mostrar banners, anuncios nativos, intersticiales, de apertura y premiados. Las recompensas son temporales, no tienen valor monetario y pueden no estar disponibles. Los anuncios premiados son voluntarios.'] },
    { title: '5. Disponibilidad y cambios', paragraphs: ['El servicio se ofrece según disponibilidad. Las funciones pueden cambiar por mantenimiento, seguridad o cumplimiento. Se mostrará la fecha de la versión.'] },
    { title: '6. Limitación', paragraphs: ['En la medida permitida por la ley, el responsable no responde por decisiones basadas solo en estimaciones, indisponibilidad o contenido de terceros. Los derechos obligatorios del consumidor se mantienen.'] },
    { title: '7. Contacto', paragraphs: ['Para consultas, usa el contacto de soporte del desarrollador indicado en la ficha oficial de la tienda.'] },
  ] },
  'fr-FR': { title: 'Conditions d’utilisation', summary: 'En utilisant PowerCost, vous acceptez ces conditions.', sections: [
    { title: '1. Objet', paragraphs: ['PowerCost fournit des estimations pédagogiques de consommation et de coût selon les données saisies.'] },
    { title: '2. Estimations et responsabilité', paragraphs: ['Les résultats ne constituent ni mesure officielle, facture, audit énergétique ni conseil professionnel. Puissance, tarifs, taxes, efficacité et habitudes peuvent modifier le montant. Confirmez les décisions importantes auprès du fournisseur ou d’un professionnel.'] },
    { title: '3. Utilisation autorisée', paragraphs: ['Utilisez l’application légalement et ne tentez pas de l’entraver, de frauder les annonces, d’exploiter des failles ou de redistribuer du contenu protégé. Vous êtes responsable des données saisies.'] },
    { title: '4. Publicités et récompenses', paragraphs: ['L’app peut afficher des bannières, annonces natives, interstitielles, d’ouverture et récompensées. Les avantages sont temporaires, sans valeur monétaire et parfois indisponibles. Les annonces récompensées sont volontaires.'] },
    { title: '5. Disponibilité et modifications', paragraphs: ['Le service est fourni selon disponibilité. Les fonctions peuvent changer pour maintenance, sécurité ou conformité. La date de version sera affichée.'] },
    { title: '6. Limitation', paragraphs: ['Dans les limites légales, le responsable ne répond pas des décisions fondées uniquement sur les estimations, de l’indisponibilité ou du contenu tiers. Les droits impératifs du consommateur restent applicables.'] },
    { title: '7. Contact', paragraphs: ['Pour toute question, utilisez le contact d’assistance du développeur indiqué sur la fiche officielle de l’application.'] },
  ] },
};

export const getLegalDocument = (type: LegalDocumentType, locale: SupportedLocale) =>
  (type === 'privacy' ? privacy : terms)[locale];
