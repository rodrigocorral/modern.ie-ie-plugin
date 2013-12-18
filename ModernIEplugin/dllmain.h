// dllmain.h : Declaration of module class.

class CModernIEpluginModule : public ATL::CAtlDllModuleT< CModernIEpluginModule >
{
public :
	DECLARE_LIBID(LIBID_ModernIEpluginLib)
	DECLARE_REGISTRY_APPID_RESOURCEID(IDR_MODERNIEPLUGIN, "{B8D0C002-AD93-48ED-9503-1232F00D5731}")
};

extern class CModernIEpluginModule _AtlModule;
