// dllmain.cpp : Implementation of DllMain.

#include "stdafx.h"
#include "resource.h"
#include "ModernIEplugin_i.h"
#include "dllmain.h"
#include "xdlldata.h"
#include "Utils.h"

CModernIEpluginModule _AtlModule;

// DLL Entry Point
extern "C" BOOL WINAPI DllMain(HINSTANCE hInstance, DWORD dwReason, LPVOID lpReserved)
{
#ifdef _MERGE_PROXYSTUB
	if (!PrxDllMain(hInstance, dwReason, lpReserved))
		return FALSE;
#endif
	CUtils::hInstance = hInstance;
	return _AtlModule.DllMain(dwReason, lpReserved); 
}
