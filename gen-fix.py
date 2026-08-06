import base64, json

pairs = []
def add(old, new):
    pairs.append([base64.b64encode(old.encode('utf-8')).decode(),
                   base64.b64encode(new.encode('utf-8')).decode()])

add('Générez un CV professionnel en 60 secondes', 'Votre plateforme IA de gestion de carrière et recrutement')
add("'Créer mon CV maintenant'", "'Commencer maintenant'")
add('Générez un CV pro en 60 secondes', 'Plateforme IA de gestion de carrière')
add("'Créer mon CV'", "'Démarrer'")
add('Generate a professional resume in 60 seconds', 'Your AI career management and recruitment platform')
add("'Create my resume now'", "'Get started now'")
add('Generate a pro resume in 60 seconds', 'AI career management platform')
add("'Create my resume'", "'Get started'")
add('أنشئ سيرة ذاتية احترافية في 60 ثانية', 'منصتك الذكية لإدارة المسار المهني والتوظيف')
add("أنشئ سيرتي الذاتية الآن'", "'ابدأ الآن'")
add('أنشئ سيرة ذاتية احترافية في 60 ثانية', 'منصة ذكية لإدارة المسار المهني')
add("إنشاء سيرتي الذاتية'", "'ابدأ الآن'")
add('Genera un currículum profesional en 60 segundos', 'Tu plataforma IA de gestión de carrera y reclutamiento')
add("'Crear mi currículum ahora'", "'Comenzar ahora'")
add('Genera un CV pro en 60 segundos', 'Plataforma IA de gestión de carrera')
add("'Crear mi CV'", "'Comenzar'")

script = 'const fs=require("fs");const f="C:\\\\Users\\\\espacegamers\\\\Desktop\\\\HireNova\\\\src\\\\lib\\\\i18n.ts";let c=fs.readFileSync(f,"utf8");const P=' + json.dumps(pairs) + ';for(const[a,b]of P){c=c.replace(Buffer.from(a,"base64").toString("utf8"),Buffer.from(b,"base64").toString("utf8"))}fs.writeFileSync(f,c,"utf8");console.log("DONE")'

print(base64.b64encode(script.encode('utf-8')).decode())
