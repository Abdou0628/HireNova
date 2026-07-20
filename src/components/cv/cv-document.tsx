'use client'

import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Briefcase,
  GraduationCap,
  Code2,
  Languages,
} from 'lucide-react'

interface CVDocumentProps {
  formData: {
    fullName: string
    email: string
    phone: string
    address: string
    location: string
    linkedin: string
    website: string
    targetJob: string
    photo: string
  }
  generatedCV: {
    summary: string
    experience: Array<{
      title: string
      company: string
      period: string
      description: string
    }>
    education: Array<{
      degree: string
      school: string
      period: string
      description: string
    }>
    skills: string[]
    languages: Array<{ name: string; level: string }>
  }
  template: 'modern' | 'classic' | 'creative'
}

/* ────────────────────────────────────────────
   Shared helpers
   ──────────────────────────────────────────── */

function ContactItem({
  icon: Icon,
  value,
  className = '',
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  value: string
  className?: string
}) {
  if (!value) return null
  return (
    <span className={`flex items-center gap-1.5 ${className}`}>
      <Icon className="h-3 w-3 shrink-0" />
      <span className="truncate">{value}</span>
    </span>
  )
}

/* ────────────────────────────────────────────
   Modern Template
   ──────────────────────────────────────────── */

function ModernTemplate({
  formData,
  generatedCV,
}: Omit<CVDocumentProps, 'template'>) {
  const { fullName, email, phone, address, location, linkedin, website, targetJob, photo } = formData
  const { summary, experience, education, skills, languages } = generatedCV
  const fullAddress = [address, location].filter(Boolean).join(', ')

  return (
    <div className="flex min-h-[297mm] w-full flex-col bg-white sm:flex-row sm:min-h-0">
      {/* ── Sidebar ── */}
      <aside className="w-full bg-emerald-900 px-5 py-7 text-white sm:w-[30%] sm:min-h-[297mm] print:min-h-0">
        {/* Photo + Name */}
        <div className="flex flex-col items-center text-center">
          {photo && (
            <img
              src={photo}
              alt=""
              className="w-24 h-24 rounded-full object-cover border-3 border-emerald-600 mb-3"
            />
          )}
            <h1 className="text-xl font-bold leading-tight tracking-tight">
            {fullName}
          </h1>
          {targetJob && (
            <p className="mt-1 text-xs font-medium tracking-wide text-emerald-200">
              {targetJob}
            </p>
          )}

        </div>
        {/* Contact */}
        <div className="mt-6 space-y-2 border-b border-emerald-700 pb-5 text-[11px] leading-relaxed text-emerald-100">
          <ContactItem icon={Mail} value={email} />
          <ContactItem icon={Phone} value={phone} />
          <ContactItem icon={MapPin} value={fullAddress} />
          <ContactItem icon={Linkedin} value={linkedin} />
          <ContactItem icon={Globe} value={website} />
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-200">
              <Code2 className="h-3.5 w-3.5" />
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded bg-emerald-800 px-2 py-0.5 text-[10px] font-medium text-emerald-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 px-6 py-7 sm:px-8">
        {/* Summary */}
        {summary && (
          <section className="mb-5">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-stone-500">
              Professional Summary
            </h2>
            <div className="h-px bg-stone-200" />
            <p className="mt-2 text-xs leading-relaxed text-stone-700">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-5">
            <h2 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-stone-500">
              <Briefcase className="h-3.5 w-3.5" />
              Experience
            </h2>
            <div className="h-px bg-stone-200" />
            <div className="mt-3 space-y-4">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold leading-tight text-stone-800">
                        {exp.title}
                      </h3>
                      <p className="text-xs text-emerald-700 font-medium">{exp.company}</p>
                    </div>
                    <span className="shrink-0 text-[10px] text-stone-400">{exp.period}</span>
                  </div>
                  {exp.description && (
                    <p className="mt-1 text-xs leading-relaxed text-stone-600">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-5">
            <h2 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-stone-500">
              <GraduationCap className="h-3.5 w-3.5" />
              Education
            </h2>
            <div className="h-px bg-stone-200" />
            <div className="mt-3 space-y-4">
              {education.map((edu, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold leading-tight text-stone-800">
                        {edu.degree}
                      </h3>
                      <p className="text-xs text-emerald-700 font-medium">{edu.school}</p>
                    </div>
                    <span className="shrink-0 text-[10px] text-stone-400">{edu.period}</span>
                  </div>
                  {edu.description && (
                    <p className="mt-1 text-xs leading-relaxed text-stone-600">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h2 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-stone-500">
              <Languages className="h-3.5 w-3.5" />
              Languages
            </h2>
            <div className="h-px bg-stone-200" />
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
              {languages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-1.5 text-xs text-stone-700">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-stone-400">&mdash;</span>
                  <span className="text-stone-500">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

/* ────────────────────────────────────────────
   Classic Template
   ──────────────────────────────────────────── */

function ClassicTemplate({
  formData,
  generatedCV,
}: Omit<CVDocumentProps, 'template'>) {
  const { fullName, email, phone, address, location, linkedin, website, targetJob, photo } = formData
  const { summary, experience, education, skills, languages } = generatedCV
  const fullAddress = [address, location].filter(Boolean).join(', ')

  return (
    <div className="min-h-[297mm] w-full bg-white px-8 py-7 print:min-h-0">
      {/* Header */}
      <header className="border-b-2 border-stone-800 pb-4">
        <div className="flex items-center justify-center gap-5">
          {photo && (
            <img
              src={photo}
              alt=""
              className="w-20 h-20 rounded-full object-cover border-2 border-stone-300"
            />
          )}
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">{fullName}</h1>
            {targetJob && (
              <p className="mt-1 text-sm font-medium text-stone-500">{targetJob}</p>
            )}
          </div>
        </div>

        {/* Contact row */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-stone-600">
          <ContactItem icon={Mail} value={email} />
          <ContactItem icon={Phone} value={phone} />
          <ContactItem icon={MapPin} value={fullAddress} />
          <ContactItem icon={Linkedin} value={linkedin} />
          <ContactItem icon={Globe} value={website} />
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mt-5">
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-800">
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-stone-600">{summary}</p>
        </section>
      )}

      <div className="my-4 h-px bg-stone-200" />

      {/* Experience */}
      {experience.length > 0 && (
        <section>
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-800">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-bold text-stone-800">{exp.title}</h3>
                  <span className="shrink-0 text-[10px] font-medium text-stone-400">
                    {exp.period}
                  </span>
                </div>
                <p className="text-xs font-medium text-stone-500 italic">{exp.company}</p>
                {exp.description && (
                  <p className="mt-1 text-xs leading-relaxed text-stone-600">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="my-4 h-px bg-stone-200" />

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-800">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-bold text-stone-800">{edu.degree}</h3>
                  <span className="shrink-0 text-[10px] font-medium text-stone-400">
                    {edu.period}
                  </span>
                </div>
                <p className="text-xs font-medium text-stone-500 italic">{edu.school}</p>
                {edu.description && (
                  <p className="mt-1 text-xs leading-relaxed text-stone-600">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="my-4 h-px bg-stone-200" />

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-800">
            Skills
          </h2>
          <p className="text-xs leading-relaxed text-stone-600">
            {skills.join('  •  ')}
          </p>
        </section>
      )}

      <div className="my-4 h-px bg-stone-200" />

      {/* Languages */}
      {languages.length > 0 && (
        <section>
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-800">
            Languages
          </h2>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-stone-600">
            {languages.map((lang) => (
              <span key={lang.name}>
                <span className="font-semibold text-stone-700">{lang.name}</span>
                {' — '}
                {lang.level}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────
   Creative Template
   ──────────────────────────────────────────── */

function CreativeTemplate({
  formData,
  generatedCV,
}: Omit<CVDocumentProps, 'template'>) {
  const { fullName, email, phone, address, location, linkedin, website, targetJob, photo } = formData
  const { summary, experience, education, skills, languages } = generatedCV
  const fullAddress = [address, location].filter(Boolean).join(', ')

  return (
    <div className="min-h-[297mm] w-full bg-white print:min-h-0">
      {/* ── Gradient Header ── */}
      <header className="bg-gradient-to-r from-emerald-800 to-teal-600 px-8 py-8 text-white">
        <div className="flex items-center gap-5">
          {photo && (
            <img
              src={photo}
              alt=""
              className="w-20 h-20 rounded-full object-cover border-3 border-white/30"
            />
          )}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{fullName}</h1>
            {targetJob && (
              <p className="mt-1 text-sm font-medium text-emerald-100">{targetJob}</p>
            )}
          </div>
        </div>
      </header>

      {/* ── Two-column body ── */}
      <div className="flex flex-col sm:flex-row">
        {/* Left column — 60% */}
        <main className="w-full px-8 py-6 sm:w-[60%]">
          {/* Summary */}
          {summary && (
            <section className="mb-5">
              <h2 className="border-l-4 border-emerald-600 pl-3 text-xs font-bold uppercase tracking-widest text-stone-700">
                About Me
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-stone-600">{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-5">
              <h2 className="border-l-4 border-emerald-600 pl-3 text-xs font-bold uppercase tracking-widest text-stone-700">
                Experience
              </h2>
              <div className="mt-3 space-y-4">
                {experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold leading-tight text-stone-800">
                          {exp.title}
                        </h3>
                        <p className="text-xs font-medium text-emerald-700">{exp.company}</p>
                      </div>
                      <span className="shrink-0 rounded bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-500">
                        {exp.period}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="mt-1 text-xs leading-relaxed text-stone-600">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="border-l-4 border-emerald-600 pl-3 text-xs font-bold uppercase tracking-widest text-stone-700">
                Education
              </h2>
              <div className="mt-3 space-y-4">
                {education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold leading-tight text-stone-800">
                          {edu.degree}
                        </h3>
                        <p className="text-xs font-medium text-emerald-700">{edu.school}</p>
                      </div>
                      <span className="shrink-0 rounded bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-500">
                        {edu.period}
                      </span>
                    </div>
                    {edu.description && (
                      <p className="mt-1 text-xs leading-relaxed text-stone-600">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Right column — 40% */}
        <aside className="w-full border-t border-stone-200 bg-stone-50 px-8 py-6 sm:w-[40%] sm:border-l sm:border-t-0">
          {/* Contact */}
          <section className="mb-6">
            <h2 className="border-l-4 border-emerald-600 pl-3 text-xs font-bold uppercase tracking-widest text-stone-700">
              Contact
            </h2>
            <div className="mt-3 space-y-2 text-[11px] text-stone-600">
              <ContactItem icon={Mail} value={email} />
              <ContactItem icon={Phone} value={phone} />
              <ContactItem icon={MapPin} value={fullAddress} />
              <ContactItem icon={Linkedin} value={linkedin} />
              <ContactItem icon={Globe} value={website} />
            </div>
          </section>

          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-6">
              <h2 className="border-l-4 border-emerald-600 pl-3 text-xs font-bold uppercase tracking-widest text-stone-700">
                Skills
              </h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-emerald-600/30 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <h2 className="border-l-4 border-emerald-600 pl-3 text-xs font-bold uppercase tracking-widest text-stone-700">
                Languages
              </h2>
              <div className="mt-3 space-y-2">
                {languages.map((lang) => (
                  <div key={lang.name} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-700">{lang.name}</span>
                    <span className="text-stone-400">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────
   Main CVDocument Component
   ──────────────────────────────────────────── */

export default function CVDocument({ formData, generatedCV, template }: CVDocumentProps) {
  return (
    <div
      id="cv-document"
      className="mx-auto max-w-[210mm] bg-white text-stone-900"
    >
      {template === 'modern' && (
        <ModernTemplate formData={formData} generatedCV={generatedCV} />
      )}
      {template === 'classic' && (
        <ClassicTemplate formData={formData} generatedCV={generatedCV} />
      )}
      {template === 'creative' && (
        <CreativeTemplate formData={formData} generatedCV={generatedCV} />
      )}
    </div>
  )
}