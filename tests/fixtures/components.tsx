import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ContactButton } from '../../src/components/Contact'
import { VideoPlayer } from '../../src/components/VideoPlayer'
import '../../src/index.css'
import '../../src/pages.css'
import type { VideoAccessibility } from '../../src/data/mediaAccessibility'

const mode = new URLSearchParams(location.search).get('mode')
const empty = {
  email: '',
  whatsapp: '',
  formularioParceirosUrl: '',
  paginaInstitucionalUrl: '',
}
const fixtureAccessibility: VideoAccessibility =
  mode === 'pending'
    ? { status: 'pending' }
    : {
        status: 'reviewed',
        evidenceId: 'synthetic-fixture-only',
        captions: [
          {
            src: '/tests/fixtures/synthetic.vtt',
            language: 'pt-BR',
            label: 'Português — teste sintético',
          },
        ],
        transcript: {
          text: 'Texto sintético de teste. Não transcreve o vídeo.',
          language: 'pt-BR',
          label: 'Transcrição de teste',
        },
      }
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <main>
      <h1>Componentes em teste</h1>
      {mode === 'contact' ? (
        <ContactButton channels={empty}>Seja Parceiro</ContactButton>
      ) : (
        <VideoPlayer
          title="Vídeo de teste"
          media={{
            id: 'synthetic',
            country: 'test',
            phase: 'test',
            activity: 0,
            type: 'video',
            original: 'fixture',
            src: '/midia/galixandria/1000396178.mp4',
            width: 640,
            height: 360,
          }}
          accessibility={fixtureAccessibility}
        />
      )}
    </main>
  </BrowserRouter>,
)
