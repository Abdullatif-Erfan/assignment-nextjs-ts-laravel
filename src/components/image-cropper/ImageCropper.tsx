import React, { useState, useRef } from 'react'
import { Box, Flex, Input, Button } from "@chakra-ui/react"

import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
} from 'react-image-crop'
import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from './useDeboundEffect'

import 'react-image-crop/dist/ReactCrop.css'
import { FormControl, FormLabel } from '@chakra-ui/react';

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

export const ImageCropper = () => {
    const [imgSrc, setImgSrc] = useState('')
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
    const blobUrlRef = useRef('')
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState<number | undefined>(16 / 9)

    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined) // Makes crop preview update between images.
            const reader = new FileReader()
            reader.addEventListener('load', () =>
                setImgSrc(reader.result ?.toString() || ''),
            )
            reader.readAsDataURL(e.target.files[0])
        }
    }

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        if (aspect) {
            const { width, height } = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    function onDownloadCropClick() {
        if (!previewCanvasRef.current) {
            throw new Error('Crop canvas does not exist')
        }

        previewCanvasRef.current.toBlob((blob) => {
            if (!blob) {
                throw new Error('Failed to create blob')
            }
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current)
            }
            blobUrlRef.current = URL.createObjectURL(blob)
            hiddenAnchorRef.current!.href = blobUrlRef.current
            hiddenAnchorRef.current!.click()
        })
    }

    useDebounceEffect(
        async () => {
            if (
                completedCrop ?.width &&
                    completedCrop ?.height &&
                    imgRef.current &&
                    previewCanvasRef.current
      ) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                    scale,
                    rotate,
                )
            }
        },
        100,
        [completedCrop, scale, rotate],
    )

    function handleToggleAspectClick() {
        if (aspect) {
            setAspect(undefined)
        } else if (imgRef.current) {
            const { width, height } = imgRef.current
            setAspect(4 / 4)
            setCrop(centerAspectCrop(width, height, 4 / 4))
        }
    }

    return (
        <Flex>
            <Box w="100%" p="30px">


                <FormControl>
                    <Input type="file" accept="image/*" onChange={onSelectFile} mb="20px" />
                </FormControl>

                <Flex>
                    <FormControl>
                        <FormLabel>Scale: </FormLabel>
                        <Input
                            type="number"
                            step="0.1"
                            value={scale}
                            disabled={!imgSrc}
                            onChange={(e) => setScale(Number(e.target.value))}
                            mb="20px"
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel ml="20px">Rotate: </FormLabel>
                        <Input
                            type="number"
                            value={rotate}
                            disabled={!imgSrc}
                            onChange={(e) =>
                                setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
                            }
                            ml="10px"
                        />
                    </FormControl>
                </Flex>

                <div>
                    <Button colorScheme='teal' mb={5} onClick={handleToggleAspectClick}>
                        Toggle aspect {aspect ? 'off' : 'on'}
                    </Button>
                </div>
                {!!imgSrc && (
                    <Flex alignItems="center" justifyContent="center" mb={10}>
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imgSrc}
                                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                onLoad={onImageLoad}
                            />
                        </ReactCrop>
                    </Flex>
                )}
                {!!completedCrop && (
                    <>
                        <Flex bg="#ddd" alignItems="center" justifyContent="center" p="20px">
                            <canvas
                                ref={previewCanvasRef}
                                style={{
                                    border: '1px solid black',
                                    objectFit: 'contain',
                                    width: completedCrop.width,
                                    height: completedCrop.height,
                                }}
                            />
                        </Flex>
                        <Box w="200px" h="200px">
                            <Button colorScheme='teal' mt={5} onClick={onDownloadCropClick}>Download Crop</Button>
                            <a
                                ref={hiddenAnchorRef}
                                download
                                style={{
                                    position: 'absolute',
                                    top: '-200vh',
                                    visibility: 'hidden',
                                }}
                            >
                                Hidden download
                       </a>
                        </Box>
                    </>
                )}
            </Box>
        </Flex>
    )
}
