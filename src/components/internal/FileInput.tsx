import { useCallback, useRef, useState } from 'react'
import type { InputProps } from '../../core/input-types'
import { assignRef } from './assign-ref'
import { uploadIcon } from './control-icons'
import { useDateLocalization } from './date-localization'
import { renderIconSource } from './render-icon-source'
import { useFormReset } from './use-form-reset'

type SingleLineProps = Extract<InputProps, { multiline?: false }>
type FileInputProps = SingleLineProps & {
  InputHost: (props: SingleLineProps) => import('react').JSX.Element
}

export function FileInput({
  InputHost,
  onChange,
  dropzone = false,
  viewProps = {},
  ...inputProps
}: FileInputProps): import('react').JSX.Element {
  const { messages } = useDateLocalization()
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const reset = useCallback(() => setSelectedFiles([]), [])
  useFormReset(inputRef, reset)

  return (
    <InputHost
      {...inputProps}
      type="file"
      dropzone={dropzone}
      clearable={false}
      onChange={(next) => {
        setSelectedFiles(Array.from(inputRef.current?.files ?? [], (file) => file.name))
        onChange?.(next)
      }}
      trailingAction={
        <span className="weave-file-input__content" aria-hidden="true">
          <span className="weave-file-input__icon">
            {renderIconSource(uploadIcon, { size: dropzone ? 'large' : 'medium' })}
          </span>
          <span className="weave-file-input__copy">
            <span className="weave-file-input__title">
              {selectedFiles.length > 0
                ? selectedFiles.length === 1
                  ? selectedFiles[0]
                  : messages.selectedFilesCount.replace('{count}', String(selectedFiles.length))
                : dropzone
                  ? messages.dropFiles
                  : messages.chooseFiles}
            </span>
            <span className="weave-file-input__subtitle">
              {selectedFiles.length > 1
                ? selectedFiles.join(', ')
                : selectedFiles.length === 1
                  ? messages.changeFile
                  : dropzone
                    ? messages.dropFilesHint
                    : messages.noFilesSelected}
            </span>
          </span>
        </span>
      }
      viewProps={{
        ...viewProps,
        className: [
          'weave-file-input__native',
          dropzone ? 'weave-file-input__native--dropzone' : undefined,
          viewProps.className,
        ]
          .filter(Boolean)
          .join(' '),
        ref: (node) => {
          inputRef.current = node
          assignRef(viewProps.ref, node)
        },
      }}
    />
  )
}
