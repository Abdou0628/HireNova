'use client'

import { FileText, Scale, Shield, Globe } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

interface LegalDialogProps {
  open: boolean
  onClose: () => void
}

export default function LegalDialog({ open, onClose }: LegalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-stone-100">
              <Scale className="w-5 h-5 text-stone-700" />
            </div>
            Mentions Légales & Conditions Générales
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm leading-relaxed">
          {/* Éditeur */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-base">1. Éditeur du site</h3>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 space-y-1">
              <p><strong>HireNova</strong></p>
              <p>Éditeur : <strong>E-Society 2050</strong></p>
              <p>Email : <a href="mailto:abdellahbazhani053@gmail.com" className="text-emerald-600 hover:underline">abdellahbazhani053@gmail.com</a></p>
              <p>Pays : Maroc</p>
            </div>
          </section>

          <Separator />

          {/* Service */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-base">2. Description du service</h3>
            </div>
            <p className="text-muted-foreground">
              HireNova est un service en ligne de génération de CV et lettres de motivation assistée par intelligence artificielle,
              disponible en 4 langues (français, anglais, arabe, espagnol) avec 3 modèles de mise en page et 2 formats de téléchargement (PDF, Word).
            </p>
          </section>

          <Separator />

          {/* CGU */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-base">3. Conditions Générales d&rsquo;Utilisation</h3>
            </div>
            <div className="space-y-3 text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-1">3.1. Accès au service</h4>
                <p>L&rsquo;accès au service nécessite la création d&rsquo;un compte et le paiement d&rsquo;un abonnement (Plan Pro ou Plan Lifetime). Le service est accessible immédiatement après le paiement via notre partenaire de paiement : <strong>LemonSqueezy</strong> (EUR/USD, carte bancaire internationale, PayPal, Apple Pay, Google Pay).</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">3.2. Utilisation autorisée</h4>
                <p>Le service est destiné à un usage personnel et professionnel légitime. L&rsquo;utilisateur s&rsquo;engage à ne pas utiliser le service à des fins illicites, frauduleuses ou portant atteinte aux droits de tiers.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">3.3. Propriété intellectuelle</h4>
                <p>Le nom &ldquo;HireNova&rdquo;, le logo, le design, le code source et l&rsquo;ensemble du contenu du site sont la propriété exclusive de <strong>E-Society 2050</strong>. Toute reproduction, copie, modification, distribution ou utilisation du service ou de ses éléments sans autorisation écrite préalable est strictement interdite et constitue une contrefaçon punie par la loi.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">3.4. Contenu généré</h4>
                <p>Les CV et lettres de motivation générés par l&rsquo;IA sont la propriété de l&rsquo;utilisateur. HireNova ne revendique aucun droit sur le contenu généré par ses utilisateurs.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">3.5. Paiements et remboursements</h4>
                <p>Les paiements sont traités par notre partenaire de paiement agréé : <strong>LemonSqueezy</strong> (EUR/USD). Pour toute demande de remboursement, veuillez contacter le support via le bouton d&rsquo;aide sur le site.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">3.6. Responsabilité</h4>
                <p>HireNova fournit un outil d&rsquo;aide à la rédaction. La qualité du résultat final dépend des informations fournies par l&rsquo;utilisateur. HireNova ne saurait être tenu responsable du contenu des documents générés ni de leur utilisation par l&rsquo;utilisateur.</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Données personnelles */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-base">4. Protection des données personnelles</h3>
            </div>
            <div className="space-y-2 text-muted-foreground">
              <p>Conformément à la législation marocaine (Loi 09-08 relative à la protection des personnes physiques à l&rsquo;égard du traitement des données à caractère personnel), nous informons les utilisateurs que :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Les données collectées (nom, email, informations de CV) sont utilisées uniquement pour le fonctionnement du service.</li>
                <li>Les données ne sont jamais vendues ou partagées avec des tiers.</li>
                <li>L&rsquo;utilisateur peut demander la suppression de ses données à tout moment en contactant le support.</li>
                <li>Les données sont stockées de manière sécurisée.</li>
              </ul>
            </div>
          </section>

          <Separator />

          {/* Droits d'auteur */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Scale className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-base">5. Droits d&rsquo;auteur</h3>
            </div>
            <p className="text-muted-foreground">
              © 2026 HireNova — <strong>E-Society 2050</strong>. Tous droits réservés.
              La marque &ldquo;HireNova&rdquo; et l&rsquo;ensemble du service sont protégés par les lois marocaines et internationales
              sur la propriété intellectuelle (Convention de Berne). Toute violation sera poursuivie.
            </p>
          </section>

          <Separator />

          {/* Hébergement */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-base">6. Hébergement</h3>
            </div>
            <p className="text-muted-foreground">
              Le site est hébergé par <strong>Vercel Inc.</strong>, San Francisco, États-Unis.
            </p>
          </section>

          <Separator />

          {/* Contact */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-base">7. Contact</h3>
            </div>
            <p className="text-muted-foreground">
              Pour toute question concernant ces mentions légales, veuillez contacter :<br />
              <a href="mailto:abdellahbazhani053@gmail.com" className="text-emerald-600 hover:underline font-medium">abdellahbazhani053@gmail.com</a>
            </p>
          </section>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Dernière mise à jour : Juillet 2026
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
