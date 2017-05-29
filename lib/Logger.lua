Logger = setmetatable({}, Logger)
Logger.__index = Logger
Logger.instance = clr.NLog.LogManager.GetLogger("MySQL")

function Logger.Trace(self, message)
    self:Get().Trace(message)
end

function Logger.Debug(self, message)
    self:Get().Debug(message)
end

function Logger.Info(self, message)
    self:Get().Info(message)
end

function Logger.Warn(self, message)
    self:Get().Warn(message)
end

function Logger.Error(self, message)
    self:Get().Error(message)
end

function Logger.Fatal(self, message)
    self:Get().Fatal(message)
end

function Logger.Get(self)
    return self.instance
end

