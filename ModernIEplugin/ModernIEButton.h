// ModernIEButton.h : Declaration of the CModernIEButton

#pragma once
#include "resource.h"       // main symbols



#include "ModernIEplugin_i.h"



#if defined(_WIN32_WCE) && !defined(_CE_DCOM) && !defined(_CE_ALLOW_SINGLE_THREADED_OBJECTS_IN_MTA)
#error "Single-threaded COM objects are not properly supported on Windows CE platform, such as the Windows Mobile platforms that do not include full DCOM support. Define _CE_ALLOW_SINGLE_THREADED_OBJECTS_IN_MTA to force ATL to support creating single-thread COM object's and allow use of it's single-threaded COM object implementations. The threading model in your rgs file was set to 'Free' as that is the only threading model supported in non DCOM Windows CE platforms."
#endif

using namespace ATL;


// CModernIEButton

class ATL_NO_VTABLE CModernIEButton :
	public CComObjectRootEx<CComSingleThreadModel>,
	public CComCoClass<CModernIEButton, &CLSID_ModernIEButton>,
	public IObjectWithSiteImpl<CModernIEButton>,
	public IDispatchImpl<IModernIEButton, &IID_IModernIEButton, &LIBID_ModernIEpluginLib, /*wMajor =*/ 1, /*wMinor =*/ 0>,
	public IOleCommandTarget
{
public:
	CModernIEButton()
	{
	}

DECLARE_REGISTRY_RESOURCEID(IDR_MODERNIEBUTTON)

DECLARE_NOT_AGGREGATABLE(CModernIEButton)

BEGIN_COM_MAP(CModernIEButton)
	COM_INTERFACE_ENTRY(IModernIEButton)
	COM_INTERFACE_ENTRY(IDispatch)
	COM_INTERFACE_ENTRY(IObjectWithSite)
	COM_INTERFACE_ENTRY(IOleCommandTarget)
END_COM_MAP()

	DECLARE_PROTECT_FINAL_CONSTRUCT()

	HRESULT FinalConstruct()
	{
		return S_OK;
	}

	void FinalRelease()
	{
	}

public:

	// IOleCommandTarget
	STDMETHOD(Exec)(const GUID *pguidCmdGroup, DWORD nCmdID,
		DWORD nCmdExecOpt, VARIANTARG *pvaIn, VARIANTARG *pvaOut);
	STDMETHOD(QueryStatus)(const GUID *pguidCmdGroup, ULONG cCmds,
		OLECMD *prgCmds, OLECMDTEXT *pCmdText);
};

OBJECT_ENTRY_AUTO(__uuidof(ModernIEButton), CModernIEButton)
