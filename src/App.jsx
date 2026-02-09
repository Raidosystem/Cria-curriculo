// App.jsx
import React, { useState, useRef, useEffect } from 'react'
import ResumeForm from './components/resumeForm'
import CVPreview from './components/CVPreview'

export default function App() {
  const [data, setData] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState('executive1')
  const [customization, setCustomization] = useState({
    photoPosition: 'right',
    photoFrame: 'square',
    margin: 'medium',
    fontSize: 'medium',
    colors: {
      primaryTitle: '#1e293b',      // Nome principal
      secondaryTitle: '#334155',    // Títulos de seções (h3)
      accent: '#3b82f6',            // Cor de destaque
      text: '#475569',              // Texto normal
      background: '#ffffff',        // Fundo principal
      sectionBg: '#f8fafc',         // Fundo de seções
      contactInfo: '#64748b',       // Informações de contato
      mutedText: '#94a3b8',         // Texto menos importante
      sidebarBg: '#1e40af',         // Fundo da sidebar (executive)
      sidebarText: '#e0e7ff'        // Texto da sidebar
    }
  })
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [customizeOpen, setCustomizeOpen] = useState(false)
  const previewRef = useRef()
  const dropdownRef = useRef()

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="app-root">
      <header className="topbar">
        <h1>Currículo Builder</h1>
        
        {/* Dropdown de Ferramentas */}
        <div className="tools-dropdown" ref={dropdownRef}>
          <button 
            className="tools-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>🛠️</span>
            Ferramentas
            <span className={`arrow ${dropdownOpen ? 'open' : ''}`}>▼</span>
          </button>
          
          {dropdownOpen && (
            <div className="dropdown-menu">
              <a 
                href="https://buscacep.aquiguaira.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <span className="item-icon">📍</span>
                <div className="item-content">
                  <strong>Busca CEP</strong>
                  <small>Encontre endereços por CEP</small>
                </div>
                <span className="external-icon">↗</span>
              </a>
            </div>
          )}
        </div>

        <p className="tag">Crie currículos profissionais — 9 modelos estilizados e prontos pra download</p>
      </header>

      <main className="main-grid">
        <section className="panel form-panel">
          <ResumeForm 
            onGenerate={(d) => setData(d)} 
            selectedTemplate={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
            customization={customization}
            onCustomizationChange={setCustomization}
          />
        </section>

        <section className="panel preview-panel">
          <CVPreview 
            ref={previewRef} 
            data={data} 
            template={selectedTemplate}
            customization={customization}
            onCustomizeClick={() => setCustomizeOpen(!customizeOpen)}
          />
        </section>
      </main>

      {/* Card de Personalização */}
      {customizeOpen && (
        <div className="customize-overlay" onClick={() => setCustomizeOpen(false)}>
          <div className="customize-card" onClick={(e) => e.stopPropagation()}>
            <div className="customize-header">
              <h2>🎨 Personalizar Cores</h2>
              <button className="close-btn" onClick={() => setCustomizeOpen(false)}>✕</button>
            </div>
            
            <div className="customize-hint">
              <span>💡</span>
              <p>As cores são aplicadas em tempo real no currículo!</p>
            </div>
            
            <div className="customize-body">
              <div className="color-section">
                <label>
                  <span className="color-label">🔤 Título Principal</span>
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      value={customization.colors.primaryTitle}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, primaryTitle: e.target.value}
                      })}
                    />
                    <input 
                      type="text" 
                      value={customization.colors.primaryTitle}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, primaryTitle: e.target.value}
                      })}
                      className="color-hex"
                    />
                  </div>
                </label>
              </div>

              <div className="color-section">
                <label>
                  <span className="color-label">📋 Subtítulos</span>
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      value={customization.colors.secondaryTitle}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, secondaryTitle: e.target.value}
                      })}
                    />
                    <input 
                      type="text" 
                      value={customization.colors.secondaryTitle}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, secondaryTitle: e.target.value}
                      })}
                      className="color-hex"
                    />
                  </div>
                </label>
              </div>

              <div className="color-section">
                <label>
                  <span className="color-label">✨ Cor de Destaque</span>
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      value={customization.colors.accent}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, accent: e.target.value}
                      })}
                    />
                    <input 
                      type="text" 
                      value={customization.colors.accent}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, accent: e.target.value}
                      })}
                      className="color-hex"
                    />
                  </div>
                </label>
              </div>

              <div className="color-section">
                <label>
                  <span className="color-label">📝 Texto</span>
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      value={customization.colors.text}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, text: e.target.value}
                      })}
                    />
                    <input 
                      type="text" 
                      value={customization.colors.text}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, text: e.target.value}
                      })}
                      className="color-hex"
                    />
                  </div>
                </label>
              </div>

              <div className="color-section">
                <label>
                  <span className="color-label">🎨 Fundo Principal</span>
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      value={customization.colors.background}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, background: e.target.value}
                      })}
                    />
                    <input 
                      type="text" 
                      value={customization.colors.background}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, background: e.target.value}
                      })}
                      className="color-hex"
                    />
                  </div>
                </label>
              </div>

              <div className="color-section">
                <label>
                  <span className="color-label">📦 Fundo de Seções</span>
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      value={customization.colors.sectionBg}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, sectionBg: e.target.value}
                      })}
                    />
                    <input 
                      type="text" 
                      value={customization.colors.sectionBg}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, sectionBg: e.target.value}
                      })}
                      className="color-hex"
                    />
                  </div>
                </label>
              </div>

              <div className="color-section">
                <label>
                  <span className="color-label">📧 Informações de Contato</span>
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      value={customization.colors.contactInfo}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, contactInfo: e.target.value}
                      })}
                    />
                    <input 
                      type="text" 
                      value={customization.colors.contactInfo}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, contactInfo: e.target.value}
                      })}
                      className="color-hex"
                    />
                  </div>
                </label>
              </div>

              <div className="color-section">
                <label>
                  <span className="color-label">💬 Texto Secundário</span>
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      value={customization.colors.mutedText}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, mutedText: e.target.value}
                      })}
                    />
                    <input 
                      type="text" 
                      value={customization.colors.mutedText}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, mutedText: e.target.value}
                      })}
                      className="color-hex"
                    />
                  </div>
                </label>
              </div>

              <div className="color-section">
                <label>
                  <span className="color-label">📘 Fundo da Barra Lateral</span>
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      value={customization.colors.sidebarBg}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, sidebarBg: e.target.value}
                      })}
                    />
                    <input 
                      type="text" 
                      value={customization.colors.sidebarBg}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, sidebarBg: e.target.value}
                      })}
                      className="color-hex"
                    />
                  </div>
                </label>
              </div>

              <div className="color-section">
                <label>
                  <span className="color-label">💡 Texto da Barra Lateral</span>
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      value={customization.colors.sidebarText}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, sidebarText: e.target.value}
                      })}
                    />
                    <input 
                      type="text" 
                      value={customization.colors.sidebarText}
                      onChange={(e) => setCustomization({
                        ...customization,
                        colors: {...customization.colors, sidebarText: e.target.value}
                      })}
                      className="color-hex"
                    />
                  </div>
                </label>
              </div>

              <div className="preset-colors">
                <h3>Paletas Pré-definidas</h3>
                <div className="preset-grid">
                  <button 
                    className="preset-btn"
                    onClick={() => setCustomization({
                      ...customization,
                      colors: {
                        primaryTitle: '#1e293b',
                        secondaryTitle: '#334155',
                        accent: '#3b82f6',
                        text: '#475569',
                        background: '#ffffff',
                        sectionBg: '#f8fafc',
                        contactInfo: '#64748b',
                        mutedText: '#94a3b8',
                        sidebarBg: '#1e40af',
                        sidebarText: '#e0e7ff'
                      }
                    })}
                  >
                    <div className="preset-preview">
                      <span style={{background: '#1e293b'}}></span>
                      <span style={{background: '#334155'}}></span>
                      <span style={{background: '#3b82f6'}}></span>
                    </div>
                    <span>Clássico Azul</span>
                  </button>

                  <button 
                    className="preset-btn"
                    onClick={() => setCustomization({
                      ...customization,
                      colors: {
                        primaryTitle: '#1e3a8a',
                        secondaryTitle: '#1e40af',
                        accent: '#2563eb',
                        text: '#334155',
                        background: '#f8fafc',
                        sectionBg: '#eff6ff',
                        contactInfo: '#475569',
                        mutedText: '#64748b',
                        sidebarBg: '#1e3a8a',
                        sidebarText: '#dbeafe'
                      }
                    })}
                  >
                    <div className="preset-preview">
                      <span style={{background: '#1e3a8a'}}></span>
                      <span style={{background: '#1e40af'}}></span>
                      <span style={{background: '#2563eb'}}></span>
                    </div>
                    <span>Profissional</span>
                  </button>

                  <button 
                    className="preset-btn"
                    onClick={() => setCustomization({
                      ...customization,
                      colors: {
                        primaryTitle: '#7c2d12',
                        secondaryTitle: '#92400e',
                        accent: '#ea580c',
                        text: '#44403c',
                        background: '#fafaf9',
                        sectionBg: '#fff7ed',
                        contactInfo: '#78716c',
                        mutedText: '#a8a29e',
                        sidebarBg: '#7c2d12',
                        sidebarText: '#fed7aa'
                      }
                    })}
                  >
                    <div className="preset-preview">
                      <span style={{background: '#7c2d12'}}></span>
                      <span style={{background: '#92400e'}}></span>
                      <span style={{background: '#ea580c'}}></span>
                    </div>
                    <span>Executivo</span>
                  </button>

                  <button 
                    className="preset-btn"
                    onClick={() => setCustomization({
                      ...customization,
                      colors: {
                        primaryTitle: '#701a75',
                        secondaryTitle: '#86198f',
                        accent: '#d946ef',
                        text: '#374151',
                        background: '#fefce8',
                        sectionBg: '#fae8ff',
                        contactInfo: '#4b5563',
                        mutedText: '#9ca3af',
                        sidebarBg: '#701a75',
                        sidebarText: '#f5d0fe'
                      }
                    })}
                  >
                    <div className="preset-preview">
                      <span style={{background: '#701a75'}}></span>
                      <span style={{background: '#86198f'}}></span>
                      <span style={{background: '#d946ef'}}></span>
                    </div>
                    <span>Criativo</span>
                  </button>

                  <button 
                    className="preset-btn"
                    onClick={() => setCustomization({
                      ...customization,
                      colors: {
                        primaryTitle: '#14532d',
                        secondaryTitle: '#15803d',
                        accent: '#22c55e',
                        text: '#1f2937',
                        background: '#f0fdf4',
                        sectionBg: '#dcfce7',
                        contactInfo: '#374151',
                        mutedText: '#6b7280',
                        sidebarBg: '#14532d',
                        sidebarText: '#bbf7d0'
                      }
                    })}
                  >
                    <div className="preset-preview">
                      <span style={{background: '#14532d'}}></span>
                      <span style={{background: '#15803d'}}></span>
                      <span style={{background: '#22c55e'}}></span>
                    </div>
                    <span>Moderno</span>
                  </button>

                  <button 
                    className="preset-btn"
                    onClick={() => setCustomization({
                      ...customization,
                      colors: {
                        primaryTitle: '#18181b',
                        secondaryTitle: '#27272a',
                        accent: '#71717a',
                        text: '#3f3f46',
                        background: '#ffffff',
                        sectionBg: '#fafafa',
                        contactInfo: '#52525b',
                        mutedText: '#a1a1aa',
                        sidebarBg: '#27272a',
                        sidebarText: '#e4e4e7'
                      }
                    })}
                  >
                    <div className="preset-preview">
                      <span style={{background: '#18181b'}}></span>
                      <span style={{background: '#27272a'}}></span>
                      <span style={{background: '#71717a'}}></span>
                    </div>
                    <span>Minimalista</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">Feito por Talisson Mendes — personalize e envie seu currículo profissional</footer>
    </div>
  )
}
