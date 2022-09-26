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
        * [.getActiveTokens()](#NCALayerClient+getActiveTokens) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
        * [.getKeyInfo(storageType)](#NCALayerClient+getKeyInfo) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.createCAdESFromBase64(storageType, data, [keyType], [attach])](#NCALayerClient+createCAdESFromBase64) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.createCAdESFromBase64Hash(storageType, hash, [keyType])](#NCALayerClient+createCAdESFromBase64Hash) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.createCMSSignatureFromBase64(storageType, data, [keyType], [attach])](#NCALayerClient+createCMSSignatureFromBase64) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.signXml(storageType, xml, [keyType], [tbsElementXPath], [signatureParentElementXPath])](#NCALayerClient+signXml) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.signXmls(storageType, xmls, [keyType], [tbsElementXPath], [signatureParentElementXPath])](#NCALayerClient+signXmls) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
        * [.changeLocale(localeId)](#NCALayerClient+changeLocale)
    * _static_
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

<a name="NCALayerClient.fileStorageType"></a>

### NCALayerClient.fileStorageType
Константа определяющая имя файлового хранилища.

**Kind**: static property of [<code>NCALayerClient</code>](#NCALayerClient)  
