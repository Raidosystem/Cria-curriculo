import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import * as htmlToImage from 'html-to-image'
import jsPDF from 'jspdf'


const CVPreview = forwardRef(({ data, template = 'executive1', customization, onCustomizeClick }, ref) => {
const nodeRef = useRef()
const [loading, setLoading] = useState(false)
const [loadingMessage, setLoadingMessage] = useState('')

// Function to render icons based on template
const renderIcon = (icon) => {
  const iconTemplates = ['creative1', 'creative2', 'creative3']
  return iconTemplates.includes(template) ? icon + ' ' : ''
}


useImperativeHandle(ref, () => ({
exportPDF: async () => await handleDownload()
}))


async function handleDownload() {
  if (!nodeRef.current) return
  setLoading(true)
  setLoadingMessage('Gerando seu PDF...')
  
  try {
    // Render the node to a high‑resolution canvas
    const fullCanvas = await htmlToImage.toCanvas(nodeRef.current, { pixelRatio: 2 })

    // Create PDF
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
    const pdfWidthPt = pdf.internal.pageSize.getWidth()
    const pdfHeightPt = pdf.internal.pageSize.getHeight()

    // The fullCanvas width/height are in device pixels. We scale the canvas image to fit pdf width.
    const imgWidthPx = fullCanvas.width
    const imgHeightPx = fullCanvas.height

    // scale ratio from px -> pdf points
    const scale = pdfWidthPt / imgWidthPx

    // compute how many vertical pixels correspond to one PDF page height
    const pageHeightPx = Math.floor(pdfHeightPt / scale)

    // If the image fits in one page, add directly
    if (imgHeightPx <= pageHeightPx) {
      const dataUrl = fullCanvas.toDataURL('image/png')
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidthPt, imgHeightPx * scale)
      pdf.save('curriculo.pdf')
      return
    }

    // Otherwise, slice the canvas vertically into page-sized pieces
    let y = 0
    while (y < imgHeightPx) {
      const sliceHeightPx = Math.min(pageHeightPx, imgHeightPx - y)

      // create temporary canvas for the slice
      const sliceCanvas = document.createElement('canvas')
      sliceCanvas.width = imgWidthPx
      sliceCanvas.height = sliceHeightPx
      const ctx = sliceCanvas.getContext('2d')

      // draw slice from full canvas
      ctx.drawImage(fullCanvas, 0, y, imgWidthPx, sliceHeightPx, 0, 0, imgWidthPx, sliceHeightPx)

      const sliceDataUrl = sliceCanvas.toDataURL('image/png')
      const sliceHeightPt = sliceHeightPx * scale

      pdf.addImage(sliceDataUrl, 'PNG', 0, 0, pdfWidthPt, sliceHeightPt)

      y += sliceHeightPx
      if (y < imgHeightPx) pdf.addPage()
    }

    pdf.save('curriculo.pdf')
    setLoading(false)
  } catch (err) {
    console.error(err)
    alert('Erro ao gerar PDF. Veja o console para detalhes.')
    setLoading(false)
  }
}

// Function to open preview in new window
async function handlePreview() {
  if (!nodeRef.current) return
  setLoading(true)
  setLoadingMessage('Preparando prévia...')
  
  try {
    // Render the node to canvas
    const canvas = await htmlToImage.toCanvas(nodeRef.current, { pixelRatio: 2 })
    const dataUrl = canvas.toDataURL('image/png')
    
    // Open in new window
    const newWindow = window.open('', '_blank')
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Prévia do Currículo</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                font-family: 'Inter', sans-serif;
              }
              .container {
                max-width: 800px;
                width: 100%;
              }
              img {
                width: 100%;
                height: auto;
                border-radius: 16px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
              }
              .header {
                text-align: center;
                color: white;
                margin-bottom: 30px;
              }
              h1 {
                font-size: 2.5rem;
                background: linear-gradient(135deg, #6366f1, #06b6d4);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 10px;
              }
              p {
                color: #cbd5e1;
                font-size: 1.1rem;
              }
              @media print {
                body { background: white; padding: 0; }
                .header { display: none; }
                img { border-radius: 0; box-shadow: none; max-width: 100%; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📄 Prévia do Currículo</h1>
                <p>Seu currículo está pronto! Use Ctrl+P para imprimir.</p>
              </div>
              <img src="${dataUrl}" alt="Currículo" />
            </div>
          </body>
        </html>
      `)
      newWindow.document.close()
    }
    
    setLoading(false)
  } catch (err) {
    console.error(err)
    alert('Erro ao gerar prévia. Veja o console para detalhes.')
    setLoading(false)
  }
}

// Classes dinâmicas baseadas na personalização
const photoPositionClass = customization?.photoPosition === 'left' ? 'photo-left' : 'photo-right'
const photoFrameClass = `photo-frame-${customization?.photoFrame || 'square'}`

// Renderiza o layout para Executive1 (com sidebar)
const renderExecutive1Layout = () => (
  <div className="cv-article">
    <div className="cv-sidebar">
      <div className="cv-photo">
        {data.photo ? (
          <img src={data.photo} alt="Foto profissional" />
        ) : (
          <div className="photo-placeholder">
            <span>📷</span>
            <small>Foto 3x4</small>
          </div>
        )}
      </div>
      
      <h1 className="cv-name">{data.basic.name}</h1>
      <p className="cv-role">{data.basic.role}</p>
      
      <div className="cv-section">
        <h3>Contato</h3>
        <div className="cv-contact">
          {data.basic.email && (
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              {data.basic.email}
            </div>
          )}
          {data.basic.phone && (
            <div className="contact-item">
              <span className="contact-icon">📱</span>
              {data.basic.phone}
            </div>
          )}
          {data.basic.city && (
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              {data.basic.city}
            </div>
          )}
          {data.basic.age && (
            <div className="contact-item">
              <span className="contact-icon">🎂</span>
              {data.basic.age} anos
            </div>
          )}
        </div>
      </div>

      {data.skills && data.skills.length > 0 && (
        <div className="cv-section">
          <h3>Habilidades</h3>
          <div className="skills">
            {data.skills.map((s, i) => (
              <span key={i} className="skill">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
    
    <div className="cv-main-content">
      {data.summary && (
        <section className="cv-section summary">
          <h3>Resumo Profissional</h3>
          <p>{data.summary}</p>
        </section>
      )}

      <section className="cv-section">
        <h3>Experiência Profissional</h3>
        {data.experiences.length > 0 && data.experiences.some(e => e.title || e.company) ? (
          data.experiences.filter(e => e.title || e.company).map((e, idx) => (
            <div key={idx} className="entry">
              <strong>{e.title}</strong>
              <div className="muted">
                {e.company}
                {(e.from || e.to) && (
                  <span> • {e.from}{e.to ? ` - ${e.to}` : ''}</span>
                )}
              </div>
              {e.description && <p>{e.description}</p>}
            </div>
          ))
        ) : (
          <p className="no-content">Nenhuma experiência adicionada</p>
        )}
      </section>

      {data.educations.length > 0 && data.educations.some(ed => ed.degree || ed.institution) && (
        <section className="cv-section">
          <h3>Educação</h3>
          {data.educations.filter(ed => ed.degree || ed.institution).map((ed, idx) => (
            <div key={idx} className="entry">
              <strong>{ed.degree}</strong>
              <div className="muted">
                {ed.institution}
                {ed.year && <span> • {ed.year}</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {data.addresses && data.addresses.length > 0 && data.addresses.some(addr => addr.street || addr.cep) && (
        <section className="cv-section">
          <h3>Endereço</h3>
          {data.addresses.filter(addr => addr.street || addr.cep).map((addr, idx) => (
            <div key={idx} className="entry">
              {addr.street && (
                <div>
                  <strong>{addr.street}{addr.number ? `, ${addr.number}` : ''}</strong>
                  {addr.complement && <span> - {addr.complement}</span>}
                </div>
              )}
              <div className="muted">
                {addr.neighborhood && <span>{addr.neighborhood}</span>}
                {addr.city && addr.state && <span> • {addr.city} - {addr.state}</span>}
                {addr.cep && <span> • CEP: {addr.cep}</span>}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  </div>
)

// Renderiza o layout padrão (para outros templates)
const renderDefaultLayout = () => (
  <article className="cv-article">
    <header className="cv-header">
      <div className="cv-left">
        <h1 className="cv-name">{data.basic.name}</h1>
        <p className="cv-role">{data.basic.role}</p>
        <div className="cv-contact">
          {data.basic.email && (
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              {data.basic.email}
            </div>
          )}
          {data.basic.phone && (
            <div className="contact-item">
              <span className="contact-icon">📱</span>
              {data.basic.phone}
            </div>
          )}
          {data.basic.city && (
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              {data.basic.city}
            </div>
          )}
          {data.basic.age && (
            <div className="contact-item">
              <span className="contact-icon">🎂</span>
              {data.basic.age} anos
            </div>
          )}
        </div>
      </div>

      <div className="cv-photo">
        {data.photo ? (
          <img src={data.photo} alt="Foto profissional" />
        ) : (
          <div className="photo-placeholder">
            <span>📷</span>
            <small>Foto 3x4</small>
          </div>
        )}
      </div>
    </header>

    {data.summary && (
      <section className="cv-section summary">
        <h3>{renderIcon('📝')}Resumo Profissional</h3>
        <p>{data.summary}</p>
      </section>
    )}

    <section className="cv-section two-cols">
      <div className="column">
        <h3>{renderIcon('💼')}Experiência Profissional</h3>
        {data.experiences.length > 0 && data.experiences.some(e => e.title || e.company) ? (
          data.experiences.filter(e => e.title || e.company).map((e, idx) => (
            <div key={idx} className="entry">
              <strong>{e.title}</strong>
              <div className="muted">
                {e.company}
                {(e.from || e.to) && (
                  <span> • {e.from}{e.to ? ` - ${e.to}` : ''}</span>
                )}
              </div>
              {e.description && <p>{e.description}</p>}
            </div>
          ))
        ) : (
          <p className="no-content">Nenhuma experiência adicionada</p>
        )}
      </div>

      <div className="column">
        <h3>{renderIcon('🎓')}Educação</h3>
        {data.educations.length > 0 && data.educations.some(ed => ed.degree || ed.institution) ? (
          data.educations.filter(ed => ed.degree || ed.institution).map((ed, idx) => (
            <div key={idx} className="entry">
              <strong>{ed.degree}</strong>
              <div className="muted">
                {ed.institution}
                {ed.year && <span> • {ed.year}</span>}
              </div>
            </div>
          ))
        ) : (
          <p className="no-content">Nenhuma formação adicionada</p>
        )}

        {data.addresses && data.addresses.length > 0 && data.addresses.some(addr => addr.street || addr.cep) && (
          <>
            <h3 style={{marginTop: '2rem'}}>{renderIcon('📍')}Endereço</h3>
            {data.addresses.filter(addr => addr.street || addr.cep).map((addr, idx) => (
              <div key={idx} className="entry">
                {addr.street && (
                  <div>
                    <strong>{addr.street}{addr.number ? `, ${addr.number}` : ''}</strong>
                    {addr.complement && <span> - {addr.complement}</span>}
                  </div>
                )}
                <div className="muted">
                  {addr.neighborhood && <span>{addr.neighborhood}</span>}
                  {addr.city && addr.state && <span> • {addr.city} - {addr.state}</span>}
                  {addr.cep && <span> • CEP: {addr.cep}</span>}
                </div>
              </div>
            ))}
          </>
        )}

        {data.skills && data.skills.length > 0 && (
          <>
            <h3 style={{marginTop: '2rem'}}>{renderIcon('⚡')}Habilidades</h3>
            <div className="skills">
              {data.skills.map((s, i) => (
                <span key={i} className="skill">{s}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  </article>
)


// Aplicar cores customizadas
const customColors = customization?.colors || {}
const styleVars = {
  '--cv-primary-title': customColors.primaryTitle || '#1e293b',
  '--cv-secondary-title': customColors.secondaryTitle || '#334155',
  '--cv-accent': customColors.accent || '#3b82f6',
  '--cv-text': customColors.text || '#475569',
  '--cv-background': customColors.background || '#ffffff',
  '--cv-section-bg': customColors.sectionBg || '#f8fafc',
  '--cv-contact-info': customColors.contactInfo || '#64748b',
  '--cv-muted-text': customColors.mutedText || '#94a3b8',
  '--cv-sidebar-bg': customColors.sidebarBg || '#1e40af',
  '--cv-sidebar-text': customColors.sidebarText || '#e0e7ff'
}

return (
<>
<div className="preview-wrapper">
<div className="preview-actions">
<button onClick={handlePreview} disabled={!data} className="preview-btn">
<span>👁️</span> Ver Prévia
</button>
<button onClick={onCustomizeClick} disabled={!data} className="customize-btn">
<span>🎨</span> Personalizar
</button>
<button onClick={handleDownload} disabled={!data} className="download-btn">
<span>📄</span> Download PDF
</button>
</div>
<div 
  className={`cv-sheet cv-template-${template} ${photoPositionClass} ${photoFrameClass}`}
  data-margin={customization?.margin || 'medium'}
  data-font-size={customization?.fontSize || 'medium'}
  style={styleVars}
  ref={nodeRef}
>
{!data ? (
<div className="empty">
<div className="empty-icon">📋</div>
<h3>Seu currículo aparecerá aqui</h3>
<p>Preencha o formulário à esquerda e clique em "Gerar Currículo" para visualizar seu CV profissional</p>
</div>
) : (
  template === 'executive1' ? renderExecutive1Layout() : renderDefaultLayout()
)}
</div>
</div>

{loading && (
<div className="loading-overlay">
<div className="loading-card">
<div className="loading-spinner"></div>
<h3>Aguarde um momento...</h3>
<p>{loadingMessage}</p>
</div>
</div>
)}
</>
)
})


export default CVPreview
