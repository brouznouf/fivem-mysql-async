# Upgrading from EssentialMode

As said in the README, this mod does not fully replace EssentialMode, it can only replace the MySQL library 
associated with.

Instead of Upgrading, all your mods one by one, this library offers a EssentialModeApi script which offers 
the same MySQL functions from version 2 and earlier.

You can then only replace this library and all your existing mods based on the EssentialMode MySQL Api will 
work like before and you will be able to upgrade to the new API offer by this library at your own pace.

In order to achieve this you will have to replace **all** contents of the 
`resources/essentialmode/lib/MySQL.lua` file by the following code:

```
require "resources/mysql-async/lib/MySQL"
require "resources/mysql-async/lib/EssentialModeApi"
```
