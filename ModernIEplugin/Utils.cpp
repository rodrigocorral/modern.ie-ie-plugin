#include "stdafx.h"
#include "Utils.h"


CUtils::CUtils()
{
}


CUtils::~CUtils()
{
}

CString CUtils::GetScriptsPath()
{
	return GetPluginPath() + CAtlString("\\Scripts\\");
}

HINSTANCE CUtils::hInstance;

CAtlString CUtils::GetPluginPath()
{
	TCHAR szPath[MAX_PATH];
	GetModuleFileName(hInstance, szPath, MAX_PATH);
	CAtlString strAppPath(szPath);
	strAppPath = strAppPath.Left(strAppPath.ReverseFind('\\'));

	return strAppPath;
}

BSTR CUtils::ReadFileToBSTR(LPCWSTR lpFileName)
{
	LARGE_INTEGER file_size;
	DWORD bytes_read;

	HANDLE hFile = ::CreateFile(lpFileName,
		GENERIC_READ,          
		FILE_SHARE_READ,       
		NULL,                  
		OPEN_EXISTING,         
		FILE_ATTRIBUTE_NORMAL,
		NULL);

	ATLVERIFY(::GetFileSizeEx(hFile, &file_size));
	ATLVERIFY(hFile != INVALID_HANDLE_VALUE);

	SIZE_T buffer_size = (SIZE_T)file_size.QuadPart;
	VOID* read_buffer = ::LocalAlloc(LMEM_ZEROINIT, buffer_size);
	ATLVERIFY(::ReadFile(hFile, read_buffer, buffer_size, &bytes_read, NULL));
	ATLVERIFY(::CloseHandle(hFile));

	CComBSTR result = CComBSTR((LPCSTR)read_buffer);

	return result;
}
