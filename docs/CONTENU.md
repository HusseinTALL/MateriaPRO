# MatériaPro — Contenu du site

Inventaire complet du contenu du site vitrine, section par section, avec le
composant source correspondant. Le site est une page unique (one-page) en
français, assemblée dans `src/pages/index.astro`.

**Identité** : MatériaPro — agence commerciale indépendante de matériaux de
construction à Ouagadougou (Burkina Faso). Positionnement : intermédiaire de
confiance entre les usines locales et les chantiers — sélection, contrôle
qualité, commercialisation et livraison organisée.

**Signature visuelle** : palette marine + or, typographies Barlow Condensed
(titres) / Archivo (corps), bandeau « coloris tôles » (rouge, vert, bleu,
marron, galva) repris dans la navbar et le footer.

---

## 1. Navigation — `src/components/Nav.astro`

- Logo : **MatériaPro** + tagline « Agence Commerciale »
- Liens : À propos · Produits · Services · Comment ça marche · Livraison · Contact
- CTA permanent : **Demander un devis**
- Menu mobile plein écran avec les mêmes entrées

## 2. Héro — `src/components/Hero.astro`

- Badge : « Agence commerciale · Matériaux de construction · Ouagadougou »
- Titre : **« Vos matériaux. Contrôlés. Livrés. »**
- Sous-titre : « Tôles, tubes, PVC, briques et quincaillerie lourde —
  approvisionnement multi-usines, contrôle qualité rigoureux et livraison
  organisée sur chantier, avec un seul interlocuteur. »
- Actions : **Demander un devis gratuit** · **Comment ça marche**
- Points de réassurance : Qualité contrôlée à la source · Livraison
  Ouagadougou & régions · Réseau multi-usines partenaires

## 3. À propos — `src/components/About.astro`

- Accroche : **« Un intermédiaire de confiance entre les usines et vos
  chantiers. »**
- Texte : MatériaPro ne fabrique pas — elle sélectionne, contrôle,
  commercialise et organise la livraison, de la commande usine à la
  réception sur chantier.
- Trois piliers :
  - **Indépendance** — « Nous représentons vos intérêts, pas ceux d'une
    seule usine. »
  - **Suivi humain** — « Un interlocuteur dédié, de la demande de devis à la
    facturation. »
  - **Ancrage local** — « Une équipe burkinabè qui connaît le terrain et vos
    contraintes chantier. »
- Légende visuelle : **FCQ** — « Chaque lot inspecté selon une fiche de
  contrôle qualité par catégorie. »

## 4. Produits — `src/components/Products.astro`

Accroche : **« Cinq familles de produits, un seul interlocuteur. »**
Note : coloris et références variés · longueurs standards ou sur mesure ·
devis personnalisé sous 24–48 h.

| Famille | Description |
| --- | --- |
| **Tôles** (carte vedette) | Bac 4 et 5 ondulations, prélaquées et galvanisées, bardage. Rouge, vert, bleu, marron, gris galva. |
| **Tubes & profilés** | Tubes carrés, rectangulaires, ronds et fer à béton pour les structures. |
| **PVC** | Tuyaux, gouttières, raccords, équipements de plomberie et d'assainissement. |
| **Briques & parpaings** | Selon disponibilité des usines partenaires. |
| **Quincaillerie lourde** | Articles complémentaires pour équiper les chantiers de bout en bout. |

Chaque carte renvoie vers « Demander un devis ».

## 5. Pourquoi MatériaPro — `src/components/Why.astro`

Accroche : **« Trois piliers, une promesse : moins de litiges, plus de
chantiers livrés à l'heure. »**

- **Sourcing multi-usines** — accès à plusieurs gammes et producteurs (CMP
  et autres fabricants locaux) via un seul interlocuteur commercial.
- **Qualité contrôlée** — chaque lot inspecté à l'enlèvement ou à réception :
  checklist par catégorie, photos, verdict conforme ou réserves.
- **Livraison organisée** — transport planifié par zone, tournées groupées,
  bon de livraison signé à la réception.

## 6. Comment ça marche — `src/components/Process.astro`

Accroche : **« De votre demande à la réception sur chantier. »** — sept
étapes, délais précisés au cas par cas dans chaque devis.

1. **Contact & demande de devis** — téléphone, WhatsApp ou formulaire.
2. **Devis détaillé** — produits, transport et délais, tout compris pour Ouagadougou.
3. **Validation & paiement** — comptant ou acompte selon le profil client.
4. **Commande usine & contrôle qualité** — inspection selon la FCQ.
5. **Organisation de la livraison** — tournée planifiée, transporteur confirmé, créneau communiqué.
6. **Réception sur chantier** — bon de livraison, vérification, signature.
7. **Facturation & suivi** — facture claire, relation commerciale dans la durée.

## 7. Services — `src/components/Services.astro`

Accroche : **« Une offre intégrée, au-delà de la vente de produits. »**

- **Devis rapide** — réponse structurée sous 24–48 h, transport inclus pour Ouagadougou.
- **Contrôle qualité** — checklist par catégorie, photos, verdict conforme / réserves / non conforme.
- **Livraison organisée** — sur chantier, par zone, bon de livraison signé.
- **Suivi de commande** — statuts clairs du devis à la livraison.
- **Conseil commercial** — choix des produits, volumes, planning chantier.
- **Échantillons** — sur demande pour les produits sensibles (tôles, profilés, PVC).

## 8. Zones de livraison — `src/components/Zones.astro`

Accroche : **« Ouagadougou en tournées planifiées, les régions sur devis. »**
Hub principal à Ouagadougou ; livraisons organisées par zone en tournées
groupées ; enlèvement direct possible sur accord du fournisseur.

Zones affichées : Ouaga 2000 · Zone industrielle · Tampouy · Dassasgho ·
Bissighin · Pissy · « + 8 autres zones » — légende : **14** zones couvertes,
régions sur devis. CTA : **Vérifier ma zone**.

## 9. Chiffres clés — `src/components/Stats.astro`

- **5** familles de produits
- **14** zones livrées à Ouagadougou
- **48 h** délai maximum de devis
- **100 %** lots inspectés avant livraison

## 10. Témoignages — `src/components/Testimonials.astro`

Accroche : **« Pensé pour les professionnels du chantier et du négoce. »**

- Chef de chantier (Entreprise BTP · Ouagadougou) : « Livré à l'heure, sans
  mauvaise surprise sur la qualité. Le contrôle avant livraison change tout
  sur nos chantiers. »
- Gérant de quincaillerie (Revendeur · Zone industrielle) : « Un grossiste
  réactif avec plusieurs gammes au même endroit. Les tournées groupées
  simplifient notre réassort. »
- Particulier en construction (Maître d'ouvrage · Ouaga 2000) : « J'ai été
  guidé du devis à la livraison à domicile. Un seul contact, des prix
  clairs, transport inclus. »

## 11. Partenaires industriels — `src/components/Partners.astro`

Accroche : **« Le bras commercial des usines locales, sans charge fixe. »**
MatériaPro apporte aux usines partenaires (CMP et autres) une clientèle BTP
qualifiée, un encadrement commercial structuré, la traçabilité qualité et
les retours terrain. Emplacements logos : CMP · Usine partenaire (×2) ·
« Votre usine ici » (invitation).

## 12. Contact / CTA final — `src/components/CtaFinal.astro`

- Titre : **« Parlons de votre prochain chantier. »**
- Promesse : devis gratuit sous 24–48 h, transport inclus pour Ouagadougou,
  interlocuteur unique du premier appel à la livraison.
- Actions : appel téléphonique · **Écrire sur WhatsApp**
- Horaires : Lun–Ven 8h–18h · Sam 8h–13h · contact@materiapro.bf

## 13. Pied de page — `src/components/Footer.astro`

- Rappel de marque + bandeau coloris tôles
- Colonnes : Produits (5 familles) · Entreprise (À propos, Services, Comment
  ça marche, Partenaires usines) · Contact (téléphone, e-mail, horaires, adresse)
- Mentions : © MatériaPro — Agence Commerciale · RCCM / IFU

Élément flottant global : bouton WhatsApp (apparaît après le héro).

---

## ⚠️ Contenu à compléter avant mise en production

| Élément | État actuel | Où |
| --- | --- | --- |
| Numéro de téléphone | `+226 XX XX XX XX` (placeholder) | Héro, CTA final, footer, bouton WhatsApp |
| Lien WhatsApp | `wa.me/226XXXXXXXX` (placeholder) | CTA final, bouton flottant |
| RCCM / IFU | « à compléter » | Footer |
| Photos | Images Unsplash génériques (chantier, contrôle qualité, camion) | Héro, À propos, Produits, Zones, CTA |
| Logos usines | Marques génériques « Usine partenaire » | Partenaires |
| Témoignages | Rédactionnels anonymes (rôles types, non attribués) | Témoignages |
| Adresse précise | « Ouagadougou, Burkina Faso » seulement | Footer |
