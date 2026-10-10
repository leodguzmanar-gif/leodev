// pages/contact.js
(function () {
  const { Link, useVisible } = window;
  const { useState } = React;

  function Section(props) {
    const { className, id, children } = props;
    const [ref, visible] = useVisible({ threshold: 0.15, once: true });
    return React.createElement(
      'section',
      {
        ref,
        id,
        className: (className || '') + ' reveal' + (visible ? ' visible' : ''),
      },
      children
    );
  }

  // ─────────────────────────────────────────────
  // Formulario de contacto (UI, sin backend todavía)
  // ─────────────────────────────────────────────
  function ContactForm() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    function update(field) {
      return function (e) {
        setForm(function (prev) {
          const next = Object.assign({}, prev);
          next[field] = e.target.value;
          return next;
        });
      };
    }

    function onSubmit(e) {
      e.preventDefault();
      setLoading(true);

      // Simulación de envío. Aquí conectarías con tu API:
      // fetch('/api/contact', { method: 'POST', body: JSON.stringify(form) })
      setTimeout(function () {
        setLoading(false);
        setSent(true);
      }, 800);
    }

    if (sent) {
      return React.createElement(
        'div',
        { className: 'contact-success' },
        React.createElement('h3', null, 'Mensaje enviado ✓'),
        React.createElement(
          'p',
          null,
          'Gracias por escribirme. Te responderé lo antes posible.'
        ),
        React.createElement(
          'button',
          {
            className: 'btn btn-ghost',
            onClick: function () {
              setSent(false);
              setForm({ name: '', email: '', message: '' });
            },
          },
          'Enviar otro'
        )
      );
    }

    return React.createElement(
      'form',
      { className: 'contact-form', onSubmit: onSubmit },

      React.createElement(
        'div',
        { className: 'form-row' },
        React.createElement(
          'label',
          { className: 'form-field' },
          React.createElement('span', null, 'Nombre'),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Tu nombre',
            value: form.name,
            onChange: update('name'),
            required: true,
          })
        ),
        React.createElement(
          'label',
          { className: 'form-field' },
          React.createElement('span', null, 'Email'),
          React.createElement('input', {
            type: 'email',
            placeholder: 'tu@correo.com',
            value: form.email,
            onChange: update('email'),
            required: true,
          })
        )
      ),

      React.createElement(
        'label',
        { className: 'form-field' },
        React.createElement('span', null, 'Mensaje'),
        React.createElement('textarea', {
          rows: 6,
          placeholder: 'Cuéntame sobre tu proyecto, idea o propuesta...',
          value: form.message,
          onChange: update('message'),
          required: true,
        })
      ),

      React.createElement(
        'div',
        { className: 'form-actions' },
        React.createElement(
          'button',
          { type: 'submit', className: 'btn btn-primary', disabled: loading },
          loading ? 'Enviando…' : 'Enviar mensaje'
        )
      )
    );
  }

  // ─────────────────────────────────────────────
  // Página Contacto
  // ─────────────────────────────────────────────
  function Contact() {
    const channels = [
      {
        label: 'Email',
        value: 'hola@ejemplo.com',
        href: 'mailto:hola@ejemplo.com',
        icon: '✉',
      },
      {
        label: 'GitHub',
        value: '@leonardoguzman',
        href: 'https://github.com/',
        icon: '◆',
      },
      {
        label: 'LinkedIn',
        value: '/in/leonardoguzman',
        href: 'https://linkedin.com/',
        icon: '▣',
      },
      {
        label: 'Ubicación',
        value: 'Venezuela · Remoto',
        href: null,
        icon: '◎',
      },
    ];

    return React.createElement(
      React.Fragment,
      null,

      // ── Hero ─────────────────────────────────
      React.createElement(
        'section',
        { className: 'page-hero' },
        React.createElement('h1', { className: 'hero-title' }, 'Hablemos de ',
          React.createElement('span', { className: 'accent' }, 'tu idea')
        ),
        React.createElement(
          'p',
          { className: 'hero-subtitle' },
          '¿Tienes un proyecto, propuesta o simplemente quieres saludar? Escríbeme y te respondo lo antes posible.'
        )
      ),

      // ── Grid: formulario + canales ────────────
      React.createElement(
        Section,
        { className: 'section-contact', id: 'contact' },

        React.createElement(
          'div',
          { className: 'contact-grid' },

          // Columna izquierda: formulario
          React.createElement(
            'div',
            { className: 'contact-form-wrapper' },
            React.createElement('h2', { className: 'section-title small' }, 'Envíame un mensaje'),
            React.createElement(ContactForm, null)
          ),

          // Columna derecha: canales directos
          React.createElement(
            'aside',
            { className: 'contact-channels' },
            React.createElement('h2', { className: 'section-title small' }, 'Otros canales'),

            React.createElement(
              'ul',
              { className: 'channel-list' },
              channels.map(function (c, i) {
                const content = React.createElement(
                  React.Fragment,
                  null,
                  React.createElement('span', { className: 'channel-icon' }, c.icon),
                  React.createElement(
                    'span',
                    { className: 'channel-body' },
                    React.createElement('span', { className: 'channel-label' }, c.label),
                    React.createElement('span', { className: 'channel-value' }, c.value)
                  )
                );

                if (c.href) {
                  return React.createElement(
                    'li',
                    { key: i, className: 'channel-item' },
                    React.createElement(
                      'a',
                      {
                        href: c.href,
                        target: c.href.startsWith('http') ? '_blank' : undefined,
                        rel: c.href.startsWith('http') ? 'noopener noreferrer' : undefined,
                      },
                      content
                    )
                  );
                }

                return React.createElement(
                  'li',
                  { key: i, className: 'channel-item static' },
                  content
                );
              })
            ),

            React.createElement('p', { className: 'contact-note' },
              'Respondo normalmente en menos de 24h en días hábiles.'
            )
          )
        )
      ),

      // ── Footer de la página (CTA volver) ──────
      React.createElement(
        Section,
        { className: 'section-contact-cta', id: 'contact-cta' },
        React.createElement('p', { className: 'cta-text' },
          'También puedes explorar mis ',
          React.createElement(Link, { to: '/projects', className: 'inline-link' }, 'proyectos'),
          ' o el ',
          React.createElement(Link, { to: '/laboratory', className: 'inline-link' }, 'laboratorio'),
          '.'
        )
      )
    );
  }

  window.Contact = Contact;
})();