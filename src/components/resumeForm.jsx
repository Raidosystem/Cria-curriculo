import React, { useState } from 'react'


const emptyExperience = () => ({ title: '', company: '', from: '', to: '', description: '' })
const emptyEducation = () => ({ institution: '', degree: '', year: '' })
const emptyAddress = () => ({ cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' })

// Dados de exemplo para preview
const exampleData = {
  photo: null,
  basic: {
    name: 'Maria Silva Santos',
    role: 'Gerente de Projetos Sênior',
    email: 'maria.silva@email.com',
    phone: '(11) 98765-4321',
    city: 'São Paulo, SP',
    age: '35'
  },
  summary: 'Profissional com mais de 10 anos de experiência em gestão de projetos, especializada em metodologias ágeis e transformação digital. Histórico comprovado de entrega de projetos complexos no prazo e dentro do orçamento, liderando equipes multidisciplinares.',
  experiences: [
    {
      title: 'Gerente de Projetos Sênior',
      company: 'Tech Solutions Brasil',
      from: 'Jan 2020',
      to: 'Atual',
      description: 'Liderança de equipe de 15 profissionais em projetos de transformação digital. Implementação de metodologias ágeis (Scrum/Kanban) resultando em 40% de aumento na produtividade.'
    },
    {
      title: 'Coordenadora de Projetos',
      company: 'Inovação Corporativa Ltda',
      from: 'Mar 2016',
      to: 'Dez 2019',
      description: 'Coordenação de múltiplos projetos simultâneos com orçamentos de até R$ 5M. Gestão de stakeholders e comunicação executiva.'
    },
    {
      title: 'Analista de Projetos',
      company: 'Consultoria Empresarial SA',
      from: 'Jun 2013',
      to: 'Fev 2016',
      description: 'Suporte em projetos de consultoria estratégica, análise de viabilidade e elaboração de documentação técnica.'
    }
  ],
  educations: [
    {
      institution: 'Universidade de São Paulo (USP)',
      degree: 'MBA em Gestão de Projetos',
      year: '2019'
    },
    {
      institution: 'Universidade Estadual de Campinas (UNICAMP)',
      degree: 'Bacharelado em Administração',
      year: '2012'
    }
  ],
  addresses: [
    {
      cep: '01310-100',
      street: 'Avenida Paulista',
      number: '1578',
      complement: 'Apto 42',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP'
    }
  ],
  skills: 'Scrum, Kanban, MS Project, Jira, Gestão de Equipes, Metodologias Ágeis, PMI, Excel Avançado, Power BI, Gestão de Riscos, Comunicação Executiva, Inglês Fluente'
}


export default function ResumeForm({ onGenerate, selectedTemplate, onTemplateChange, customization, onCustomizationChange }) {
const [photo, setPhoto] = useState(null)
const [basic, setBasic] = useState({ name: '', role: '', email: '', phone: '', city: '', age: '' })
const [summary, setSummary] = useState('')
const [experiences, setExperiences] = useState([emptyExperience()])
const [educations, setEducations] = useState([emptyEducation()])
const [addresses, setAddresses] = useState([emptyAddress()])
const [loadingCEP, setLoadingCEP] = useState({})
const [skills, setSkills] = useState('')
const [expandedCategory, setExpandedCategory] = useState(null)

const templates = [
  // Executivos
  { 
    id: 'executive1', 
    name: 'Corporate Elite', 
    description: 'Design executivo sofisticado com linhas duplas e fonte serifada elegante',
    icon: '👔',
    category: 'Executivo'
  },
  { 
    id: 'executive2', 
    name: 'Minimalist Pro', 
    description: 'Estilo minimalista profissional com linhas laterais e espaçamento limpo',
    icon: '💼',
    category: 'Executivo'
  },
  { 
    id: 'executive3', 
    name: 'Elegant Business', 
    description: 'Design centrado elegante com tons terrosos e fonte clássica',
    icon: '🎩',
    category: 'Executivo'
  },
  // Clássicos
  { 
    id: 'classic1', 
    name: 'Traditional', 
    description: 'Layout tradicional simples e direto com formatação básica',
    icon: '📋',
    category: 'Clássico'
  },
  { 
    id: 'classic2', 
    name: 'Simple Clean', 
    description: 'Design limpo com fundo suave e toques de azul profissional',
    icon: '📄',
    category: 'Clássico'
  },
  { 
    id: 'classic3', 
    name: 'Professional Standard', 
    description: 'Formato profissional padrão com grade organizada e bordas laterais',
    icon: '📝',
    category: 'Clássico'
  },
  // Criativos
  { 
    id: 'creative1', 
    name: 'Modern Gradient', 
    description: 'Design moderno com gradiente roxo vibrante e seções com efeito vidro',
    icon: '🎨',
    category: 'Criativo'
  },
  { 
    id: 'creative2', 
    name: 'Vibrant Colors', 
    description: 'Layout colorido vibrante com cabeçalho rosa-laranja e seções destacadas',
    icon: '🌈',
    category: 'Criativo'
  },
  { 
    id: 'creative3', 
    name: 'Neon Dark', 
    description: 'Tema escuro futurista com efeitos neon ciano e rosa para destaque',
    icon: '⚡',
    category: 'Criativo'
  }
]

// Agrupar templates por categoria
const executiveTemplates = templates.filter(t => t.category === 'Executivo')
const classicTemplates = templates.filter(t => t.category === 'Clássico')
const creativeTemplates = templates.filter(t => t.category === 'Criativo')

const categories = [
  { id: 'executive', name: 'Executivo', icon: '💼', description: 'Formais e Profissionais', templates: executiveTemplates },
  { id: 'classic', name: 'Clássico', icon: '📋', description: 'Tradicionais e Limpos', templates: classicTemplates },
  { id: 'creative', name: 'Criativo', icon: '🎨', description: 'Modernos e Vibrantes', templates: creativeTemplates }
]

function toggleCategory(categoryId) {
  setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
}


function handlePhoto(e) {
const f = e.target.files[0]
if (!f) return
const reader = new FileReader()
reader.onload = () => setPhoto(reader.result)
reader.readAsDataURL(f)
}


function updateExperience(idx, key, val) {
setExperiences((s) => s.map((it, i) => (i === idx ? { ...it, [key]: val } : it)))
}


function addExperience() { setExperiences((s) => [...s, emptyExperience()]) }
function removeExperience(i) { setExperiences((s) => s.filter((_, idx) => idx !== i)) }


function updateEducation(idx, key, val) {
setEducations((s) => s.map((it, i) => (i === idx ? { ...it, [key]: val } : it)))
}
function addEducation() { setEducations((s) => [...s, emptyEducation()]) }
function removeEducation(i) { setEducations((s) => s.filter((_, idx) => idx !== i)) }

function updateAddress(idx, key, val) {
setAddresses((s) => s.map((it, i) => (i === idx ? { ...it, [key]: val } : it)))
}
function addAddress() { setAddresses((s) => [...s, emptyAddress()]) }
function removeAddress(i) { setAddresses((s) => s.filter((_, idx) => idx !== i)) }

// Função para buscar CEP na API ViaCEP
async function fetchCEP(cep, idx) {
  const cleanCEP = cep.replace(/\D/g, '')
  if (cleanCEP.length !== 8) return
  
  setLoadingCEP({...loadingCEP, [idx]: true})
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
    const data = await response.json()
    
    if (data.erro) {
      alert('CEP não encontrado!')
      setLoadingCEP({...loadingCEP, [idx]: false})
      return
    }
    
    setAddresses((s) => s.map((it, i) => (i === idx ? {
      ...it,
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || ''
    } : it)))
    
    setLoadingCEP({...loadingCEP, [idx]: false})
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    alert('Erro ao buscar CEP. Tente novamente.')
    setLoadingCEP({...loadingCEP, [idx]: false})
  }
}

// Função para carregar dados de exemplo
function loadExample() {
setPhoto(exampleData.photo)
setBasic(exampleData.basic)
setSummary(exampleData.summary)
setExperiences(exampleData.experiences)
setEducations(exampleData.educations)
setAddresses(exampleData.addresses)
setSkills(exampleData.skills)

// Gera automaticamente o currículo com os dados de exemplo
const payload = { 
  photo: exampleData.photo, 
  basic: exampleData.basic, 
  summary: exampleData.summary, 
  experiences: exampleData.experiences, 
  educations: exampleData.educations,
  addresses: exampleData.addresses,
  skills: exampleData.skills.split(',').map(s => s.trim()).filter(Boolean) 
}
onGenerate(payload)
}

function submit(e) {
e.preventDefault()
const payload = { photo, basic, summary, experiences, educations, addresses, skills: skills.split(',').map(s => s.trim()).filter(Boolean) }
onGenerate(payload)
}


return (
<form className="resume-form" onSubmit={submit}>
<div className="section">
<h2>🎯 Escolha o Modelo</h2>

{/* Categorias com expansão */}
{categories.map((category) => (
<div key={category.id} style={{marginBottom: '1rem'}}>
  {/* Botão da Categoria */}
  <div 
    className={`category-header ${expandedCategory === category.id ? 'expanded' : ''}`}
    onClick={() => toggleCategory(category.id)}
  >
    <div className="category-icon">{category.icon}</div>
    <div className="category-info">
      <h3>{category.name}</h3>
      <p>{category.description}</p>
    </div>
    <div className="category-arrow">
      {expandedCategory === category.id ? '▼' : '▶'}
    </div>
  </div>

  {/* Sub-opções (Templates) */}
  {expandedCategory === category.id && (
    <div className="template-selector" style={{marginTop: '0.75rem', paddingLeft: '1rem'}}>
      {category.templates.map((template) => (
        <div 
          key={template.id}
          className={`template-option ${selectedTemplate === template.id ? 'selected' : ''}`}
          onClick={() => onTemplateChange(template.id)}
        >
          <div className="template-icon">{template.icon}</div>
          <div className="template-info">
            <h3>{template.name}</h3>
            <p>{template.description}</p>
          </div>
          <div className="template-radio">
            <input 
              type="radio" 
              name="template" 
              value={template.id}
              checked={selectedTemplate === template.id}
              onChange={() => onTemplateChange(template.id)}
            />
          </div>
        </div>
      ))}
    </div>
  )}
</div>
))}
</div>

{/* Seção de Personalização */}
<div className="section">
<h2>⚙️ Personalização</h2>

<div className="row">
  <div>
    <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
      📸 Posição da Foto
    </label>
    <select 
      value={customization.photoPosition} 
      onChange={(e) => onCustomizationChange({...customization, photoPosition: e.target.value})}
    >
      <option value="right">Direita</option>
      <option value="left">Esquerda</option>
    </select>
  </div>

  <div>
    <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
      🖼️ Formato da Moldura
    </label>
    <select 
      value={customization.photoFrame} 
      onChange={(e) => onCustomizationChange({...customization, photoFrame: e.target.value})}
    >
      <option value="square">Quadrada</option>
      <option value="rounded">Arredondada</option>
      <option value="circle">Circular</option>
    </select>
  </div>
</div>

<div className="row">
  <div>
    <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
      📏 Tamanho das Margens
    </label>
    <select 
      value={customization.margin} 
      onChange={(e) => onCustomizationChange({...customization, margin: e.target.value})}
    >
      <option value="small">Pequena</option>
      <option value="medium">Média</option>
      <option value="large">Grande</option>
    </select>
  </div>

  <div>
    <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
      🔤 Tamanho da Fonte
    </label>
    <select 
      value={customization.fontSize} 
      onChange={(e) => onCustomizationChange({...customization, fontSize: e.target.value})}
    >
      <option value="small">Pequena</option>
      <option value="medium">Média</option>
      <option value="large">Grande</option>
    </select>
  </div>
</div>
</div>

<div className="section">
<h2>👤 Informações Básicas</h2>
<div className="row">
<input placeholder="Nome completo" value={basic.name} onChange={e => setBasic({...basic, name: e.target.value})} required />
<input placeholder="Cargo / Título" value={basic.role} onChange={e => setBasic({...basic, role: e.target.value})} />
</div>
<div className="row">
<input type="email" placeholder="Email" value={basic.email} onChange={e => setBasic({...basic, email: e.target.value})} />
<input type="tel" placeholder="Telefone" value={basic.phone} onChange={e => setBasic({...basic, phone: e.target.value})} />
</div>
<div className="row">
<input placeholder="Cidade" value={basic.city} onChange={e => setBasic({...basic, city: e.target.value})} />
<input type="number" placeholder="Idade" value={basic.age} onChange={e => setBasic({...basic, age: e.target.value})} min="16" max="100" />
</div>
<div className="row">
<label className="photo-input">
<span>Adicionar Foto 3x4</span>
<input type="file" accept="image/*" onChange={handlePhoto} />
</label>
</div>
</div>


<div className="section">
<h2>📝 Resumo Profissional</h2>
<div className="row single">
<textarea placeholder="Descreva brevemente sua experiência e objetivos profissionais (2-4 linhas)" value={summary} onChange={e => setSummary(e.target.value)} />
</div>
</div>


<div className="section">
<h2>💼 Experiência Profissional</h2>
{experiences.map((exp, i) => (
<div className="card-inline" key={i}>
<div className="card-header">
<h3>Experiência {i + 1}</h3>
{experiences.length > 1 && (
<button type="button" className="remove-btn" onClick={() => removeExperience(i)} title="Remover experiência">
❌
</button>
)}
</div>
<div className="row">
<input placeholder="Título/Posição" value={exp.title} onChange={e => updateExperience(i,'title',e.target.value)} />
<input placeholder="Empresa" value={exp.company} onChange={e => updateExperience(i,'company',e.target.value)} />
</div>
<div className="row">
<input placeholder="Data de início (ex: Jan 2020)" value={exp.from} onChange={e => updateExperience(i,'from',e.target.value)} />
<input placeholder="Data de fim (ex: Dez 2022 ou Atual)" value={exp.to} onChange={e => updateExperience(i,'to',e.target.value)} />
</div>
<div className="row single">
<textarea placeholder="Descreva suas principais responsabilidades e conquistas nesta posição" value={exp.description} onChange={e => updateExperience(i,'description',e.target.value)} />
</div>
</div>
))}
<button type="button" className="add-btn" onClick={addExperience}>
<span>➕</span> Adicionar Experiência
</button>
</div>

<div className="section">
<h2>🎓 Educação</h2>
{educations.map((edu, i) => (
<div className="card-inline" key={i}>
<div className="card-header">
<h3>Formação {i + 1}</h3>
{educations.length > 1 && (
<button type="button" className="remove-btn" onClick={() => removeEducation(i)} title="Remover formação">
❌
</button>
)}
</div>
<div className="row">
<input placeholder="Instituição de Ensino" value={edu.institution} onChange={e => updateEducation(i,'institution',e.target.value)} />
<input placeholder="Curso/Grau" value={edu.degree} onChange={e => updateEducation(i,'degree',e.target.value)} />
</div>
<div className="row single">
<input placeholder="Ano de conclusão (ex: 2020)" value={edu.year} onChange={e => updateEducation(i,'year',e.target.value)} />
</div>
</div>
))}
<button type="button" className="add-btn" onClick={addEducation}>
<span>➕</span> Adicionar Formação
</button>
</div>

<div className="section">
<h2>📍 Endereço</h2>
{addresses.map((addr, i) => (
<div className="card-inline" key={i}>
<div className="card-header">
<h3>Endereço {i + 1}</h3>
{addresses.length > 1 && (
<button type="button" className="remove-btn" onClick={() => removeAddress(i)} title="Remover endereço">
❌
</button>
)}
</div>
<div className="row">
<div style={{position: 'relative', flex: 1}}>
<input 
  placeholder="CEP (ex: 01310-100)" 
  value={addr.cep} 
  onChange={e => updateAddress(i,'cep',e.target.value)}
  onBlur={(e) => fetchCEP(e.target.value, i)}
  maxLength="9"
  style={{paddingRight: loadingCEP[i] ? '40px' : '12px'}}
/>
{loadingCEP[i] && (
  <span style={{
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.2rem'
  }}>
    🔍
  </span>
)}
</div>
<input 
  placeholder="Número" 
  value={addr.number} 
  onChange={e => updateAddress(i,'number',e.target.value)} 
  style={{flex: '0 0 150px'}}
/>
</div>
<div className="row">
<input 
  placeholder="Rua/Avenida" 
  value={addr.street} 
  onChange={e => updateAddress(i,'street',e.target.value)} 
  disabled={loadingCEP[i]}
/>
<input 
  placeholder="Complemento (opcional)" 
  value={addr.complement} 
  onChange={e => updateAddress(i,'complement',e.target.value)} 
/>
</div>
<div className="row">
<input 
  placeholder="Bairro" 
  value={addr.neighborhood} 
  onChange={e => updateAddress(i,'neighborhood',e.target.value)} 
  disabled={loadingCEP[i]}
/>
<input 
  placeholder="Cidade" 
  value={addr.city} 
  onChange={e => updateAddress(i,'city',e.target.value)} 
  disabled={loadingCEP[i]}
/>
</div>
<div className="row single">
<input 
  placeholder="Estado (UF)" 
  value={addr.state} 
  onChange={e => updateAddress(i,'state',e.target.value)} 
  maxLength="2"
  style={{textTransform: 'uppercase'}}
  disabled={loadingCEP[i]}
/>
</div>
</div>
))}
<button type="button" className="add-btn" onClick={addAddress}>
<span>➕</span> Adicionar Endereço
</button>
</div>

<div className="section">
<h2>⚡ Habilidades</h2>
<div className="row single">
<textarea placeholder="Digite suas habilidades separadas por vírgula (ex: JavaScript, React, Node.js, Python, Gestão de Projetos)" value={skills} onChange={e => setSkills(e.target.value)} />
</div>
<div className="skills-preview">
{skills && skills.split(',').map(s => s.trim()).filter(Boolean).length > 0 && (
<div className="skills-list">
<strong>Preview das habilidades:</strong>
<div className="skills">
{skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => (
<span key={i} className="skill-preview">{skill}</span>
))}
</div>
</div>
)}
</div>
</div>

<div className="actions-row">
<button type="button" onClick={loadExample} className="example-btn">
<span>✨</span> Gerar Exemplo
</button>
<button type="submit" className="primary generate-btn">
<span>🚀</span> Gerar Currículo
</button>
</div>
</form>
)
}