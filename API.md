## Classes

<dl>
<dt><a href="#NCALayerError">NCALayerError</a></dt>
<dd><p>Класс ошибок NCALayerError.</p>
</dd>
<dt><a href="#NCALayerClient">NCALayerClient</a></dt>
<dd><p>Класс клиента NCALayer.</p>
</dd>
</dl>

<a name="NCALayerError"></a>

## NCALayerError
Класс ошибок NCALayerError.

**Kind**: global class  
<a name="NCALayerClient"></a>

## NCALayerClient
Класс клиента NCALayer.

**Kind**: global class  

* [NCALayerClient](#NCALayerClient)
    * [new NCALayerClient([url])](#new_NCALayerClient_new)
    * _instance_
        * [.connect()](#NCALayerClient+connect) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.basicsSign(allowedStorages, format, data, signingParams, signerParams, locale)](#NCALayerClient+basicsSign) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.basicsSignCMS(allowedStorages, data, signingParams, signerParams, [locale])](#NCALayerClient+basicsSignCMS) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.basicsSignXML(allowedStorages, data, signingParams, signerParams, [locale])](#NCALayerClient+basicsSignXML) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.getActiveTokens()](#NCALayerClient+getActiveTokens) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
        * [.getKeyInfo(storageType)](#NCALayerClient+getKeyInfo) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.createCAdESFromBase64(storageType, data, [keyType], [attach])](#NCALayerClient+createCAdESFromBase64) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.createCAdESFromBase64Hash(storageType, hash, [keyType])](#NCALayerClient+createCAdESFromBase64Hash) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.createCMSSignatureFromBase64(storageType, data, [keyType], [attach])](#NCALayerClient+createCMSSignatureFromBase64) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.signXml(storageType, xml, [keyType], [tbsElementXPath], [signatureParentElementXPath])](#NCALayerClient+signXml) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.signXmls(storageType, xmls, [keyType], [tbsElementXPath], [signatureParentElementXPath])](#NCALayerClient+signXmls) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
        * [.changeLocale(localeId)](#NCALayerClient+changeLocale)
    * _static_
        * [.basicsStorageKAZTOKEN](#NCALayerClient.basicsStorageKAZTOKEN)
        * [.basicsStorageIDCard](#NCALayerClient.basicsStorageIDCard)
        * [.basicsStorageEToken72k](#NCALayerClient.basicsStorageEToken72k)
        * [.basicsStorageEToken5110](#NCALayerClient.basicsStorageEToken5110)
        * [.basicsStorageJaCarta](#NCALayerClient.basicsStorageJaCarta)
        * [.basicsStorageAKey](#NCALayerClient.basicsStorageAKey)
        * [.basicsStoragePKCS12](#NCALayerClient.basicsStoragePKCS12)
        * [.basicsStorageJKS](#NCALayerClient.basicsStorageJKS)
        * [.basicsStorageAll](#NCALayerClient.basicsStorageAll)
        * [.basicsStorageHardware](#NCALayerClient.basicsStorageHardware)
        * [.basicsCMSParams](#NCALayerClient.basicsCMSParams)
        * [.basicsCMSParamsDetached](#NCALayerClient.basicsCMSParamsDetached)
        * [.basicsCMSParamsDetachedHash](#NCALayerClient.basicsCMSParamsDetachedHash)
        * [.basicsCMSParamsAttached](#NCALayerClient.basicsCMSParamsAttached)
        * [.basicsXMLParams](#NCALayerClient.basicsXMLParams)
        * [.basicsSignerAny](#NCALayerClient.basicsSignerAny)
        * [.basicsSignerSignAny](#NCALayerClient.basicsSignerSignAny)
        * [.basicsSignerSignPerson](#NCALayerClient.basicsSignerSignPerson)
        * [.basicsSignerSignOrg](#NCALayerClient.basicsSignerSignOrg)
        * [.basicsSignerSignHead](#NCALayerClient.basicsSignerSignHead)
        * [.basicsSignerSignTrusted](#NCALayerClient.basicsSignerSignTrusted)
        * [.basicsSignerSignEmployee](#NCALayerClient.basicsSignerSignEmployee)
        * [.basicsSignerAuthAny](#NCALayerClient.basicsSignerAuthAny)
        * [.basicsSignerAuthPerson](#NCALayerClient.basicsSignerAuthPerson)
        * [.basicsSignerAuthOrg](#NCALayerClient.basicsSignerAuthOrg)
        * [.basicsSignerAuthHead](#NCALayerClient.basicsSignerAuthHead)
        * [.basicsSignerAuthRight](#NCALayerClient.basicsSignerAuthRight)
        * [.basicsSignerAuthEmployee](#NCALayerClient.basicsSignerAuthEmployee)
        * [.basicsSignerTestAny](#NCALayerClient.basicsSignerTestAny)
        * [.fileStorageType](#NCALayerClient.fileStorageType)

<a name="new_NCALayerClient_new"></a>

### new NCALayerClient([url])
Конструктор.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [url] | <code>String</code> | <code>&#x27;wss://127.0.0.1:13579&#x27;</code> | опциональный URL для подключения к NCALayer. |

<a name="NCALayerClient+connect"></a>

### *(async)* ncaLayerClient.connect() ⇒ <code>Promise.&lt;String&gt;</code>
Подключиться к NCALayer.

**Kind**: instance method of [<code>NCALayerClient</code>](#NCALayerClient)  
**Returns**: <code>Promise.&lt;String&gt;</code> - версию NCALayer.  
**Throws**:

- NCALayerError

<a name="NCALayerClient+basicsSign"></a>

### *(async)* ncaLayerClient.basicsSign(allowedStorages, format, data, signingParams, signerParams, locale) ⇒ <code>Promise.&lt;String&gt;</code>
Вычислить подпись под данными с указанными параметрами. **Новая функция sign 2022 года из
модуля kz.gov.pki.knca.basics (https://github.com/pkigovkz/sdkinfo/wiki/KNCA-Basics-Module)**.
Сигнатура функции сложная, поэтому рекомендуем пользоваться функциями помощниками
basicsSignXLM и basicsSignCMS.

**Kind**: instance method of [<code>NCALayerClient</code>](#NCALayerClient)  
**Returns**: <code>Promise.&lt;String&gt;</code> - подпись.  
**Throws**:

- NCALayerError


| Param | Type | Description |
| --- | --- | --- |
| allowedStorages | <code>Array</code> | массив строк с константами допустимых для использования типов хранилищ (см. константы basicsStorage*). |
| format | <code>String</code> | тип вычисляемой подписи: 'xml', либо 'cms'. |
| data | <code>String</code> | подписываемые данные. |
| signingParams | <code>Object</code> | параметры подписания (см. basicsCMSParams* и basicsXMLParams*). |
| signerParams | <code>Object</code> | параметры выбора сертификата для подписания (см. константы basicsSigner*). |
| locale | <code>String</code> | язык пользовательского интерфейса. |

<a name="NCALayerClient+basicsSignCMS"></a>

### *(async)* ncaLayerClient.basicsSignCMS(allowedStorages, data, signingParams, signerParams, [locale]) ⇒ <code>Promise.&lt;String&gt;</code>
Вычислить CMS подпись под данными с указанными параметрами, это функция-помощник для
упрощения работы с функцией basicsSign.

**Kind**: instance method of [<code>NCALayerClient</code>](#NCALayerClient)  
**Returns**: <code>Promise.&lt;String&gt;</code> - подпись.  
**Throws**:

- NCALayerError


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| allowedStorages | <code>Array</code> |  | массив строк с константами допустимых для использования типов хранилищ (см. константы basicsStorage*). |
| data | <code>String</code> \| <code>ArrayBuffer</code> |  | данные, которые нужно подписать, в виде строки Base64 либо ArrayBuffer. |
| signingParams | <code>Object</code> |  | параметры подписания (см basicsCMSParams*). |
| signerParams | <code>Object</code> |  | параметры выбора сертификата для подписания (см. константы basicsSigner*). |
| [locale] | <code>String</code> | <code>&#x27;ru&#x27;</code> | язык пользовательского интерфейса. |

<a name="NCALayerClient+basicsSignXML"></a>

### *(async)* ncaLayerClient.basicsSignXML(allowedStorages, data, signingParams, signerParams, [locale]) ⇒ <code>Promise.&lt;String&gt;</code>
Вычислить XML подпись под данными с указанными параметрами, это функция-помощник для
упрощения работы с функцией basicsSign.

**Kind**: instance method of [<code>NCALayerClient</code>](#NCALayerClient)  
**Returns**: <code>Promise.&lt;String&gt;</code> - подпись.  
**Throws**:

- NCALayerError


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| allowedStorages | <code>Array</code> |  | массив строк с константами допустимых для использования типов хранилищ (см. константы basicsStorage*). |
| data | <code>String</code> |  | подписываемые данные. |
| signingParams | <code>Object</code> |  | параметры подписания (см basicsXMLParams*). |
| signerParams | <code>Object</code> |  | параметры выбора сертификата для подписания (см. константы basicsSigner*). |
| [locale] | <code>String</code> | <code>&#x27;ru&#x27;</code> | язык пользовательского интерфейса. |

<a name="NCALayerClient+getActiveTokens"></a>

### *(async)* ncaLayerClient.getActiveTokens() ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Получить список активных типов устройств.

**Kind**: instance method of [<code>NCALayerClient</code>](#NCALayerClient)  
**Returns**: <code>Promise.&lt;Array.&lt;String&gt;&gt;</code> - массив содержащий типы хранилищ экземпляры которых доступны в
данный момент.  
**Throws**:

- NCALayerError

<a name="NCALayerClient+getKeyInfo"></a>

### *(async)* ncaLayerClient.getKeyInfo(storageType) ⇒ <code>Promise.&lt;Object&gt;</code>
Получить информацию об одной записи (ключевой паре с сертификатом).

**Kind**: instance method of [<code>NCALayerClient</code>](#NCALayerClient)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - объект с информацией о записи.  
**Throws**:

- NCALayerError


| Param | Type | Description |
| --- | --- | --- |
| storageType | <code>String</code> | тип хранилища на экземплярах которого следует искать записи. |

<a name="NCALayerClient+createCAdESFromBase64"></a>

### *(async)* ncaLayerClient.createCAdESFromBase64(storageType, data, [keyType], [attach]) ⇒ <code>Promise.&lt;String&gt;</code>
Вычислить подпись под данными и сформировать CMS (CAdES).

**Kind**: instance method of [<code>NCALayerClient</code>](#NCALayerClient)  
**Returns**: <code>Promise.&lt;String&gt;</code> - CMS подпись в виде Base64 строки.  
**Throws**:

- NCALayerError


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| storageType | <code>String</code> |  | тип хранилища который следует использовать для подписания. |
| data | <code>String</code> \| <code>ArrayBuffer</code> |  | данные которые нужно подписать в виде строки Base64 либо ArrayBuffer. |
| [keyType] | <code>String</code> | <code>&#x27;SIGNATURE&#x27;</code> | каким типом ключа следует подписывать, поддерживаемые варианты 'SIGNATURE' и 'AUTHENTICATION', иное значение позволит пользователю выбрать любой доступный в хранилище ключа. |
| [attach] | <code>Boolean</code> | <code>false</code> | следует ли включить в подпись подписываемые данные. |

<a name="NCALayerClient+createCAdESFromBase64Hash"></a>

### *(async)* ncaLayerClient.createCAdESFromBase64Hash(storageType, hash, [keyType]) ⇒ <code>Promise.&lt;String&gt;</code>
Вычислить подпись под хешем данных и сформировать CMS (CAdES).

**Kind**: instance method of [<code>NCALayerClient</code>](#NCALayerClient)  
**Returns**: <code>Promise.&lt;String&gt;</code> - CMS подпись в виде Base64 строки.  
**Throws**:

- NCALayerError


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| storageType | <code>String</code> |  | тип хранилища который следует использовать для подписания. |
| hash | <code>String</code> |  | хеш данных в виде строки Base64 либо ArrayBuffer. |
| [keyType] | <code>String</code> | <code>&#x27;SIGNATURE&#x27;</code> | каким типом ключа следует подписывать, поддерживаемые варианты 'SIGNATURE' и 'AUTHENTICATION', иное значение позволит пользователю выбрать любой доступный в хранилище ключа. |

<a name="NCALayerClient+createCMSSignatureFromBase64"></a>

### *(async)* ncaLayerClient.createCMSSignatureFromBase64(storageType, data, [keyType], [attach]) ⇒ <code>Promise.&lt;String&gt;</code>
Подписать блок данных и сформировать CMS (CAdES) подпись с интегрированной меткой времени
TSP. **Не рекомендуется использовать, разработчики NCALayer пометили как DEPRECATED (https://forum.pki.gov.kz/t/podpis-s-metkoj-vremeni-na-js/704/7)!**

**Kind**: instance method of [<code>NCALayerClient</code>](#NCALayerClient)  
**Returns**: <code>Promise.&lt;String&gt;</code> - CMS подпись в виде Base64 строки.  
**Throws**:

- NCALayerError


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| storageType | <code>String</code> |  | тип хранилища который следует использовать для подписания. |
| data | <code>String</code> \| <code>ArrayBuffer</code> |  | данные которые нужно подписать в виде строки Base64 либо ArrayBuffer. |
| [keyType] | <code>String</code> | <code>&#x27;SIGNATURE&#x27;</code> | каким типом ключа следует подписывать, поддерживаемые варианты 'SIGNATURE' и 'AUTHENTICATION', иное значение позволит пользователю выбрать любой доступный в хранилище ключа. |
| [attach] | <code>Boolean</code> | <code>false</code> | следует ли включить в подпись подписываемые данные. |

<a name="NCALayerClient+signXml"></a>

### *(async)* ncaLayerClient.signXml(storageType, xml, [keyType], [tbsElementXPath], [signatureParentElementXPath]) ⇒ <code>Promise.&lt;String&gt;</code>
Вычислить подпись под документом в формате XML.

**Kind**: instance method of [<code>NCALayerClient</code>](#NCALayerClient)  
**Returns**: <code>Promise.&lt;String&gt;</code> - XML документ содержащий XMLDSIG подпись.  
**Throws**:

- NCALayerError


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| storageType | <code>String</code> |  | тип хранилища который следует использовать для подписания. |
| xml | <code>String</code> |  | XML данные которые нужно подписать. |
| [keyType] | <code>String</code> | <code>&#x27;SIGNATURE&#x27;</code> | каким типом ключа следует подписывать, поддерживаемые варианты 'SIGNATURE' и 'AUTHENTICATION', иное значение позволит пользователю выбрать любой доступный в хранилище ключа. |
| [tbsElementXPath] | <code>String</code> | <code>&#x27;&#x27;</code> | путь к подписываемому узлу XML. |
| [signatureParentElementXPath] | <code>String</code> | <code>&#x27;&#x27;</code> | путь к узлу в который необходимо добавить сформированную подпись. |

<a name="NCALayerClient+signXmls"></a>

### *(async)* ncaLayerClient.signXmls(storageType, xmls, [keyType], [tbsElementXPath], [signatureParentElementXPath]) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Вычислить подпись под каждым из массива документов в формате XML.

**Kind**: instance method of [<code>NCALayerClient</code>](#NCALayerClient)  
**Returns**: <code>Promise.&lt;Array.&lt;String&gt;&gt;</code> - массив XML документов содержащих XMLDSIG подписи.  
**Throws**:

- NCALayerError


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| storageType | <code>String</code> |  | тип хранилища который следует использовать для подписания. |
| xmls | <code>Array.&lt;String&gt;</code> |  | массив XML данных которые нужно подписать. |
| [keyType] | <code>String</code> | <code>&#x27;SIGNATURE&#x27;</code> | каким типом ключа следует подписывать, поддерживаемые варианты 'SIGNATURE' и 'AUTHENTICATION', иное значение позволит пользователю выбрать любой доступный в хранилище ключа. |
| [tbsElementXPath] | <code>String</code> | <code>&#x27;&#x27;</code> | путь к подписываемому узлу XML. |
| [signatureParentElementXPath] | <code>String</code> | <code>&#x27;&#x27;</code> | путь к узлу в который необходимо добавить сформированную подпись. |

<a name="NCALayerClient+changeLocale"></a>

### *(async)* ncaLayerClient.changeLocale(localeId)
Изменить язык интерфейса NCALayer.

**Kind**: instance method of [<code>NCALayerClient</code>](#NCALayerClient)  
**Throws**:

- NCALayerError


| Param | Type | Description |
| --- | --- | --- |
| localeId | <code>String</code> | новый идентификатор языка. |

<a name="NCALayerClient.basicsStorageKAZTOKEN"></a>

### NCALayerClient.basicsStorageKAZTOKEN
KAZTOKEN

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsStorageIDCard"></a>

### NCALayerClient.basicsStorageIDCard
Удостоверение личности

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsStorageEToken72k"></a>

### NCALayerClient.basicsStorageEToken72k
eToken 72k

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsStorageEToken5110"></a>

### NCALayerClient.basicsStorageEToken5110
eToken 5110

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsStorageJaCarta"></a>

### NCALayerClient.basicsStorageJaCarta
JaCarta

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsStorageAKey"></a>

### NCALayerClient.basicsStorageAKey
aKey

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsStoragePKCS12"></a>

### NCALayerClient.basicsStoragePKCS12
Файловле хранилище PKCS#12

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsStorageJKS"></a>

### NCALayerClient.basicsStorageJKS
Файловле хранилище JKS

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsStorageAll"></a>

### NCALayerClient.basicsStorageAll
Любые хранилища.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsStorageHardware"></a>

### NCALayerClient.basicsStorageHardware
Только аппаратные хранилища.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsCMSParams"></a>

### NCALayerClient.basicsCMSParams
Параметры подписания для формирования CMS по умолчанию.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsCMSParamsDetached"></a>

### NCALayerClient.basicsCMSParamsDetached
Параметры подписания для формирования CMS без вложенных данных из данных в Base64.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsCMSParamsDetachedHash"></a>

### NCALayerClient.basicsCMSParamsDetachedHash
Параметры подписания для формирования CMS без вложенных данных из хеша данных в Base64.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsCMSParamsAttached"></a>

### NCALayerClient.basicsCMSParamsAttached
Параметры подписания для формирования CMS с вложенными данными из данных в Base64.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsXMLParams"></a>

### NCALayerClient.basicsXMLParams
Параметры подписания для формирования XML по умолчанию.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsSignerAny"></a>

### NCALayerClient.basicsSignerAny
Любой сертификат выпущенный боевым УЦ НУЦ.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsSignerSignAny"></a>

### NCALayerClient.basicsSignerSignAny
Любой сертификат для подписания выпущенный боевым УЦ НУЦ.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsSignerSignPerson"></a>

### NCALayerClient.basicsSignerSignPerson
Сертификат физического лица для подписания выпущенный боевым УЦ НУЦ.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsSignerSignOrg"></a>

### NCALayerClient.basicsSignerSignOrg
Сертификат любого сотрудника юридического лица для подписания выпущенный боевым УЦ НУЦ.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsSignerSignHead"></a>

### NCALayerClient.basicsSignerSignHead
Сертификат руководителя юридического лица для подписания выпущенный боевым УЦ НУЦ.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsSignerSignTrusted"></a>

### NCALayerClient.basicsSignerSignTrusted
Сертификат лица с правом подписи юридического лица для подписания выпущенный боевым УЦ НУЦ.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsSignerSignEmployee"></a>

### NCALayerClient.basicsSignerSignEmployee
Сертификат сотрудника юридического лица для подписания выпущенный боевым УЦ НУЦ.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsSignerAuthAny"></a>

### NCALayerClient.basicsSignerAuthAny
Любой сертификат для аутентификации выпущенный боевым УЦ НУЦ.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsSignerAuthPerson"></a>

### NCALayerClient.basicsSignerAuthPerson
Сертификат физического лица для аутентификации выпущенный боевым УЦ НУЦ.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsSignerAuthOrg"></a>

### NCALayerClient.basicsSignerAuthOrg
Сертификат любого сотрудника юридического лица для аутентификации выпущенный боевым УЦ НУЦ.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsSignerAuthHead"></a>

### NCALayerClient.basicsSignerAuthHead
Сертификат руководителя юридического лица для аутентификации выпущенный боевым УЦ НУЦ.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsSignerAuthRight"></a>

### NCALayerClient.basicsSignerAuthRight
Сертификат лица с правом подписи юридического лица для аутентификации выпущенный боевым УЦ
НУЦ.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsSignerAuthEmployee"></a>

### NCALayerClient.basicsSignerAuthEmployee
Сертификат сотрудника юридического лица для аутентификации выпущенный боевым УЦ НУЦ.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.basicsSignerTestAny"></a>

### NCALayerClient.basicsSignerTestAny
Любой сертификат выпущенный боевым или тестовым УЦ НУЦ.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
<a name="NCALayerClient.fileStorageType"></a>

### NCALayerClient.fileStorageType
Константа определяющая имя файлового хранилища.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
