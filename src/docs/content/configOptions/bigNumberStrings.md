---
id: 14
name: 'bigNumberStrings'
---
Enabling both `supportBigNumbers` and `bigNumberStrings` forces big numbers (BIGINT and DECIMAL columns)
to be always returned as JavaScript String objects (Default: `false`).

Enabling `supportBigNumbers` but leaving `bigNumberStrings` disabled will return big numbers as String objects 
only when they cannot be accurately represented with
[JavaScript Number objects](http://ecma262-5.com/ELS5_HTML.htm#Section_8.5) (which happens when they exceed
the [-2<sup>53</sup>, +2<sup>53</sup>] range), otherwise they will be returned as Number objects. This option is ignored if
`supportBigNumbers` is disabled.