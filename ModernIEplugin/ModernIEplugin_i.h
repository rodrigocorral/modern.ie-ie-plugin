

/* this ALWAYS GENERATED file contains the definitions for the interfaces */


 /* File created by MIDL compiler version 8.00.0603 */
/* at Wed Jan 29 17:58:08 2014
 */
/* Compiler settings for ModernIEplugin.idl:
    Oicf, W1, Zp8, env=Win32 (32b run), target_arch=X86 8.00.0603 
    protocol : dce , ms_ext, c_ext, robust
    error checks: allocation ref bounds_check enum stub_data 
    VC __declspec() decoration level: 
         __declspec(uuid()), __declspec(selectany), __declspec(novtable)
         DECLSPEC_UUID(), MIDL_INTERFACE()
*/
/* @@MIDL_FILE_HEADING(  ) */

#pragma warning( disable: 4049 )  /* more than 64k source lines */


/* verify that the <rpcndr.h> version is high enough to compile this file*/
#ifndef __REQUIRED_RPCNDR_H_VERSION__
#define __REQUIRED_RPCNDR_H_VERSION__ 475
#endif

#include "rpc.h"
#include "rpcndr.h"

#ifndef __RPCNDR_H_VERSION__
#error this stub requires an updated version of <rpcndr.h>
#endif // __RPCNDR_H_VERSION__

#ifndef COM_NO_WINDOWS_H
#include "windows.h"
#include "ole2.h"
#endif /*COM_NO_WINDOWS_H*/

#ifndef __ModernIEplugin_i_h__
#define __ModernIEplugin_i_h__

#if defined(_MSC_VER) && (_MSC_VER >= 1020)
#pragma once
#endif

/* Forward Declarations */ 

#ifndef __IModernIEButton_FWD_DEFINED__
#define __IModernIEButton_FWD_DEFINED__
typedef interface IModernIEButton IModernIEButton;

#endif 	/* __IModernIEButton_FWD_DEFINED__ */


#ifndef __ModernIEButton_FWD_DEFINED__
#define __ModernIEButton_FWD_DEFINED__

#ifdef __cplusplus
typedef class ModernIEButton ModernIEButton;
#else
typedef struct ModernIEButton ModernIEButton;
#endif /* __cplusplus */

#endif 	/* __ModernIEButton_FWD_DEFINED__ */


/* header files for imported files */
#include "oaidl.h"
#include "ocidl.h"

#ifdef __cplusplus
extern "C"{
#endif 


#ifndef __IModernIEButton_INTERFACE_DEFINED__
#define __IModernIEButton_INTERFACE_DEFINED__

/* interface IModernIEButton */
/* [unique][nonextensible][dual][uuid][object] */ 


EXTERN_C const IID IID_IModernIEButton;

#if defined(__cplusplus) && !defined(CINTERFACE)
    
    MIDL_INTERFACE("77D1DAFF-891B-481D-93A4-4DC9DD7EE8BB")
    IModernIEButton : public IDispatch
    {
    public:
    };
    
    
#else 	/* C style interface */

    typedef struct IModernIEButtonVtbl
    {
        BEGIN_INTERFACE
        
        HRESULT ( STDMETHODCALLTYPE *QueryInterface )( 
            IModernIEButton * This,
            /* [in] */ REFIID riid,
            /* [annotation][iid_is][out] */ 
            _COM_Outptr_  void **ppvObject);
        
        ULONG ( STDMETHODCALLTYPE *AddRef )( 
            IModernIEButton * This);
        
        ULONG ( STDMETHODCALLTYPE *Release )( 
            IModernIEButton * This);
        
        HRESULT ( STDMETHODCALLTYPE *GetTypeInfoCount )( 
            IModernIEButton * This,
            /* [out] */ UINT *pctinfo);
        
        HRESULT ( STDMETHODCALLTYPE *GetTypeInfo )( 
            IModernIEButton * This,
            /* [in] */ UINT iTInfo,
            /* [in] */ LCID lcid,
            /* [out] */ ITypeInfo **ppTInfo);
        
        HRESULT ( STDMETHODCALLTYPE *GetIDsOfNames )( 
            IModernIEButton * This,
            /* [in] */ REFIID riid,
            /* [size_is][in] */ LPOLESTR *rgszNames,
            /* [range][in] */ UINT cNames,
            /* [in] */ LCID lcid,
            /* [size_is][out] */ DISPID *rgDispId);
        
        /* [local] */ HRESULT ( STDMETHODCALLTYPE *Invoke )( 
            IModernIEButton * This,
            /* [annotation][in] */ 
            _In_  DISPID dispIdMember,
            /* [annotation][in] */ 
            _In_  REFIID riid,
            /* [annotation][in] */ 
            _In_  LCID lcid,
            /* [annotation][in] */ 
            _In_  WORD wFlags,
            /* [annotation][out][in] */ 
            _In_  DISPPARAMS *pDispParams,
            /* [annotation][out] */ 
            _Out_opt_  VARIANT *pVarResult,
            /* [annotation][out] */ 
            _Out_opt_  EXCEPINFO *pExcepInfo,
            /* [annotation][out] */ 
            _Out_opt_  UINT *puArgErr);
        
        END_INTERFACE
    } IModernIEButtonVtbl;

    interface IModernIEButton
    {
        CONST_VTBL struct IModernIEButtonVtbl *lpVtbl;
    };

    

#ifdef COBJMACROS


#define IModernIEButton_QueryInterface(This,riid,ppvObject)	\
    ( (This)->lpVtbl -> QueryInterface(This,riid,ppvObject) ) 

#define IModernIEButton_AddRef(This)	\
    ( (This)->lpVtbl -> AddRef(This) ) 

#define IModernIEButton_Release(This)	\
    ( (This)->lpVtbl -> Release(This) ) 


#define IModernIEButton_GetTypeInfoCount(This,pctinfo)	\
    ( (This)->lpVtbl -> GetTypeInfoCount(This,pctinfo) ) 

#define IModernIEButton_GetTypeInfo(This,iTInfo,lcid,ppTInfo)	\
    ( (This)->lpVtbl -> GetTypeInfo(This,iTInfo,lcid,ppTInfo) ) 

#define IModernIEButton_GetIDsOfNames(This,riid,rgszNames,cNames,lcid,rgDispId)	\
    ( (This)->lpVtbl -> GetIDsOfNames(This,riid,rgszNames,cNames,lcid,rgDispId) ) 

#define IModernIEButton_Invoke(This,dispIdMember,riid,lcid,wFlags,pDispParams,pVarResult,pExcepInfo,puArgErr)	\
    ( (This)->lpVtbl -> Invoke(This,dispIdMember,riid,lcid,wFlags,pDispParams,pVarResult,pExcepInfo,puArgErr) ) 


#endif /* COBJMACROS */


#endif 	/* C style interface */




#endif 	/* __IModernIEButton_INTERFACE_DEFINED__ */



#ifndef __ModernIEpluginLib_LIBRARY_DEFINED__
#define __ModernIEpluginLib_LIBRARY_DEFINED__

/* library ModernIEpluginLib */
/* [version][uuid] */ 


EXTERN_C const IID LIBID_ModernIEpluginLib;

EXTERN_C const CLSID CLSID_ModernIEButton;

#ifdef __cplusplus

class DECLSPEC_UUID("73234FA1-5970-48C3-AE91-41347EFB248C")
ModernIEButton;
#endif
#endif /* __ModernIEpluginLib_LIBRARY_DEFINED__ */

/* Additional Prototypes for ALL interfaces */

/* end of Additional Prototypes */

#ifdef __cplusplus
}
#endif

#endif


