import { Group, InputElement } from "@chakra-ui/react"
import { Children, cloneElement, forwardRef } from "react"

export const InputGroup = forwardRef(function InputGroup(props, ref) {
  const { startElement, endElement, children, startElementProps, endElementProps, ...rest } = props
  
  const childrenArray = Children.toArray(children)
  const inputElement = childrenArray.find(child => child.type?.displayName !== 'InputLeftElement' && child.type?.displayName !== 'InputRightElement')
  
  return (
    <Group ref={ref} {...rest}>
      {startElement && (
        <InputElement pointerEvents="none" {...startElementProps}>
          {startElement}
        </InputElement>
      )}
      {inputElement && cloneElement(inputElement, {
        ...(startElement && { ps: "calc(var(--input-height) - 6px)" }),
        ...(endElement && { pe: "calc(var(--input-height) - 6px)" }),
        ...inputElement.props,
      })}
      {endElement && (
        <InputElement placement="end" {...endElementProps}>
          {endElement}
        </InputElement>
      )}
    </Group>
  )
})

export const InputLeftElement = forwardRef(function InputLeftElement(props, ref) {
  return <InputElement ref={ref} placement="start" {...props} />
})

InputLeftElement.displayName = 'InputLeftElement'

export const InputRightElement = forwardRef(function InputRightElement(props, ref) {
  return <InputElement ref={ref} placement="end" {...props} />
})

InputRightElement.displayName = 'InputRightElement'