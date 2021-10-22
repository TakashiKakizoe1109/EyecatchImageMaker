/*!
 * https://takashikakizoe1109.github.io/eyecatch-image-maker/
 * Released under the MIT license
 * https://github.com/TakashiKakizoe1109/eyecatch-image-maker/blob/main/LICENSE.md
 */
(function (w, $) {
    w.jscolor.presets.myPreset = {
        format: 'rgba',
        width: 201,
        height: 81,
        backgroundColor: '#333',
        palette: '#fff #000 #808080 #996e36 #f55525 #ffe438 #88dd20 #22e0cd #269aff #bb1cd4',
    };

    const ecim = {
        isRecover: false,
        e: {
            'title': {},
            'coverSize': {},
            'backgroundColor': {},
            'blurStrength': {},
            'fontFamily': {},
            'fontColor': {},
            'fontSize': {},
            'fontWeight': {},
            'lineHeight': {},
            'letterSpacing': {},
            'textShadowStrength': {},
            'textShadowLength': {},
            'textShadowColor': {}
        },
        params: {
            'title': {},
            'coverSize': {},
            'backgroundColor': {},
            'blurStrength': {},
            'fontFamily': {},
            'fontColor': {},
            'fontSize': {},
            'fontWeight': {},
            'lineHeight': {},
            'letterSpacing': {},
            'textShadowStrength': {},
            'textShadowLength': {},
            'textShadowColor': {}
        },
        event: {
            change: function (e) {
                ecim.params[e.target.id.replace('js-', '')] = e.target.value;
                ecim.func.updateStyle();
            },
            download: function () {
                w.html2canvas(w.document.querySelector('#js-image-wrapper')).then(function (canvas) {
                    let date = new Date(), a = date.getTime(), b = Math.floor(a / 1000);
                    let downloadEle = document.createElement('a');
                    downloadEle.href = canvas.toDataURL('image/png');
                    downloadEle.download = 'eye-catch-' + b + '.png';
                    downloadEle.click();
                });
            }
        },
        func: {
            setChangeEvents: function (array) {
                for (let i = 0; i < array.length; ++i) {
                    ecim.func.setChangeEvent(array[i]);
                }
            },
            setChangeEvent: function (id) {
                ecim.e[id] = w.document.querySelector('#js-' + id);
                ecim.e[id].addEventListener('change', ecim.event.change);
                try {
                    if (ecim.e[id].value) {
                        ecim.params[id] = ecim.e[id].value;
                    } else if (ecim.e[id].innerText) {
                        ecim.params[id] = ecim.e[id].innerText;
                    }
                } catch (error) {
                }
            },
            setHtmlFormValues: function (params) {
                try {
                    ecim.isRecover = true;
                    ecim.params = params;
                    ecim.e.title.value = params.title;
                    ecim.e.coverTitle.innerHTML = params.title;
                    ecim.e.coverSize.value = params.coverSize;
                    ecim.e.backgroundColor.value = params.backgroundColor;
                    ecim.e.blurStrength.value = params.blurStrength;
                    ecim.e.fontFamily.value = params.fontFamily;
                    ecim.e.fontColor.value = params.fontColor;
                    ecim.e.fontSize.value = params.fontSize;
                    ecim.e.fontWeight.value = params.fontWeight;
                    ecim.e.lineHeight.value = params.lineHeight;
                    ecim.e.letterSpacing.value = params.letterSpacing;
                    ecim.e.textShadowStrength.value = params.textShadowStrength;
                    ecim.e.textShadowLength.value = params.textShadowLength;
                    ecim.e.textShadowColor.value = params.textShadowColor;
                    if (params.srcBase64) {
                        w.document.querySelector('#js-image-wrapper img').setAttribute('src', params.srcBase64);
                    }
                } catch (error) {
                    console.error(error);
                }
                ecim.func.updateStyle();
            },
            updateStyle: function () {
                ecim.e.cover.style.background = ecim.params.backgroundColor;
                ecim.e.cover.style['backdrop-filter'] = 'blur(' + ecim.params.blurStrength + 'px)';
                ecim.e.cover.style['-webkit-backdrop-filter'] = 'blur(' + ecim.params.blurStrength + 'px)';
                ecim.e.cover.style.height = (ecim.params.coverSize * 1) + '%';
                ecim.e.cover.style.top = ((100 - ecim.params.coverSize * 1) / 2) + '%';
                ecim.e.coverTitle.innerHTML = ecim.params.title;
                ecim.e.coverTitle.style['font-family'] = ecim.params.fontFamily;
                ecim.e.coverTitle.style.color = ecim.params.fontColor;
                ecim.e.coverTitle.style['font-size'] = ecim.params.fontSize + 'px';
                ecim.e.coverTitle.style['font-weight'] = ecim.params.fontWeight;
                ecim.e.coverTitle.style['line-height'] = ecim.params.lineHeight + 'px';
                ecim.e.coverTitle.style['letter-spacing'] = ecim.params.letterSpacing + 'px';

                ecim.params.textShadowStrength = ecim.params.textShadowStrength * 1;
                if (ecim.params.textShadowStrength > 0) {
                    let shadow = ecim.params.textShadowLength + ' ' + ecim.params.textShadowColor;
                    for (let i = 1; i < ecim.params.textShadowStrength; ++i) {
                        shadow += ', ' + ecim.params.textShadowLength + ' ' + ecim.params.textShadowColor;
                    }
                    ecim.e.coverTitle.style['text-shadow'] = shadow;
                } else {
                    ecim.e.coverTitle.style['text-shadow'] = 'none';
                }
                w.localStorage.setItem('EyeCatchMakerData', JSON.stringify(ecim.params));
            },
            fileUpload: function () {

                let image = w.document.querySelector('#js-image-wrapper img');
                let imageCallBack = function (dataURL) {
                    if (ecim.isRecover === false) {
                        w.document.querySelector('#js-image-wrapper img').setAttribute('src', dataURL);
                        ecim.params.srcBase64 = dataURL;
                    }
                };
                ecim.func.imageToBase64(image.getAttribute('src'), "image/png", imageCallBack);

                const imageWrapper = w.document.querySelector('#js-image-wrapper');
                imageWrapper.addEventListener('dragover', function (e) {
                    e.preventDefault();
                    imageWrapper.classList.add('--dragover');
                });
                imageWrapper.addEventListener('dragleave', function (e) {
                    e.preventDefault();
                    imageWrapper.classList.remove('--dragover');
                });
                imageWrapper.addEventListener('drop', function (e) {
                    try {
                        e.preventDefault();
                        imageWrapper.classList.remove('--dragover');
                        const files = e.dataTransfer.files;
                        const reader = new FileReader();
                        reader.onload = function () {
                            image.setAttribute('src', reader.result);
                            ecim.params.srcBase64 = reader.result;
                            w.localStorage.setItem('EyeCatchMakerData', JSON.stringify(ecim.params));
                        };
                        reader.readAsDataURL(files[0]);
                    } catch (error) {
                    }
                });
            },
            imageToBase64: function (url, outputFormat, callback) {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                let image = new Image;
                image.crossOrigin = 'Anonymous';
                image.onload = function () {
                    canvas.height = image.height;
                    canvas.width = image.width;
                    ctx.drawImage(image, 0, 0);
                    let dataURL = canvas.toDataURL(outputFormat || 'image/png');
                    callback.call(this, dataURL);
                    canvas = null;
                };
                image.src = url;
            },
        }
    };
    w.addEventListener('DOMContentLoaded', function () {

        $('#js-fontFamily').select2().on('select2:select', function (e) {
            ecim.params.fontFamily = e.params.data.id;
            ecim.func.updateStyle();
        });

        w.document.querySelector('#js-download').addEventListener('click', ecim.event.download);

        ecim.e.imageWrapper = w.document.querySelector('#js-image-wrapper');
        ecim.e.cover = w.document.querySelector('#js-cover');
        ecim.e.coverTitle = w.document.querySelector('#js-cover-title');

        ecim.func.setChangeEvents(['title', 'coverSize', 'backgroundColor', 'blurStrength', 'fontFamily', 'fontColor', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textShadowStrength', 'textShadowLength', 'textShadowColor']);
        try {
            let localData = w.localStorage.getItem('EyeCatchMakerData');
            if (localData !== null) {
                localData = JSON.parse(localData);
                if (typeof localData.title != 'undefined') {
                    const recover = w.confirm('Do you want to recover your data?');
                    if (recover) {
                        ecim.func.setHtmlFormValues(localData);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
        ecim.func.fileUpload();
    });
}(window, jQuery));