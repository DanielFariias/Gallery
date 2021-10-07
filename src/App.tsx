import { FormEvent, useEffect, useState } from 'react'
import * as S from './app.styles'
import { PhotoItem } from './components/PhotoItem'
import * as Photos from './services/photos'
import { Photo } from './types/Photo'

const App = () => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([])

  useEffect(() => {
    const getPhotos = async () => {
      setLoading(true)
      setPhotos(await Photos.getAll())
      setLoading(false)
    }
    getPhotos()
  }, [])

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const file = formData.get('image') as File

    if (file && file.size > 0) {
      setUploading(true)
      let result = await Photos.insert(file)
      setUploading(false)

      if (result instanceof Error) {
        alert(`${result.name} - ${result.message}`);
      } else {
        let newPhotoList = [...photos];
        newPhotoList.push(result);
        setPhotos(newPhotoList);
      }
    }
  }

  return (
    <S.Container>
      <S.Area>
        <S.Header>Galeria de Fotos</S.Header>

        <S.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name="image" />
          <input type="submit" value="Enviar" />
          {uploading && "Enviando...✨"}
        </S.UploadForm>

        {loading &&
          <S.ScreenWarning>
            <div className="emoji">✋</div>
            <div>Carregando...</div>
          </S.ScreenWarning>
        }

        {!loading && photos.length > 0 &&
          <S.PhotoList>
            {photos.map((item, index) => (
              <PhotoItem
                key={index}
                url={item.url}
                name={item.name}
              />
            ))}
          </S.PhotoList>
        }

        {!loading && photos.length === 0 &&
          <S.ScreenWarning>
            <div className="emoji">😔</div>
            <div>Não hã fotos cadastradas</div>
          </S.ScreenWarning>
        }
      </S.Area>
    </S.Container>
  )
}

export default App