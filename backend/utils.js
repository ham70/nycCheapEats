export function isPNG(buffer) {
    // PNG file signature in hexadecimal: 89 50 4E 47 0D 0A 1A 0A
    const pngSignature = '89504e470d0a1a0a';
    const bufferSignature = buffer.toString('hex', 0, 8);
    if (bufferSignature === pngSignature) {
        return true;
    } else {
        return false;
    }
}

export function isJPEG(buffer) {
    // JPEG file signatures in hexadecimal: FF D8 FF
    const jpegSignatures = ['ffd8ffdb', 'ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe8'];
    const bufferSignature = buffer.toString('hex', 0, 4);
    if (jpegSignatures.includes(bufferSignature)) {
        return true;
    } else {
        return false;
    }
}

export default function getImageType(imageBuffer) {
    if(isPNG(imageBuffer)) {
        return 'image/png'
    }
    if(isJPEG(imageBuffer)){
        return 'image/jpg'
    }
    else {
        return 'image/unknown'
    }
}