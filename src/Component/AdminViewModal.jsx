import React from "react";

const AdminViewModal = () => {
    
    return (<>
        {/* View Modal */}
        <Modal open={viewmodalOpen} onClose={() => { setViewModalOpen(false); setSelectedRow(null); }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 680,
                    maxHeight: "90vh",
                    overflowY: "auto",
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    boxShadow: 24,
                    outline: "none",
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 3,
                        py: 2,
                        bgcolor: "#1e3a5f",
                        borderRadius: "12px 12px 0 0",
                    }}
                >
                    <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
                        View Request Details — {selectedRow?.requestId}
                    </Typography>
                    <IconButton onClick={() => { setViewModalOpen(false); setSelectedRow(null); }} sx={{ color: "#fff" }}>
                        <Close />
                    </IconButton>
                </Box>

                <Box sx={{ px: 3, py: 2.5 }}>

                    {/* Section 1 — Request Info */}
                    <Typography variant="subtitle2" sx={{ color: "#1e3a5f", fontWeight: 700, mb: 1.5, textTransform: "uppercase", letterSpacing: 0.8, fontSize: 11 }}>
                        Request Information
                    </Typography>

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, mb: 2 }}>
                        {[
                            { label: "Facility", value: selectedRow?.facility },
                            { label: "Location", value: selectedRow?.location },
                            { label: "Apartment", value: selectedRow?.apartment },
                            { label: "Category", value: selectedRow?.category },
                            { label: "Sub Category", value: selectedRow?.subCategory },
                            { label: "Employee Name", value: selectedRow?.employeeName },
                            { label: "Mobile", value: selectedRow?.contactNo },
                            { label: "Date", value: selectedRow?.requestDate },
                        ].map(({ label, value }) => (
                            <Box key={label}>
                                <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.3 }}>{label}</Typography>
                                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}>{value || "—"}</Typography>
                            </Box>
                        ))}

                        {/* Attachment */}
                        <Box>
                            <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.3 }}>Attachment</Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<AttachFile sx={{ fontSize: 13 }} />}
                                sx={{ fontSize: 12, textTransform: "none", borderRadius: 2, py: 0.3 }}
                            >
                                View File
                            </Button>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Section 2 — Approver Info */}
                    <Typography variant="subtitle2" sx={{ color: "#1e3a5f", fontWeight: 700, mb: 1.5, textTransform: "uppercase", letterSpacing: 0.8, fontSize: 11 }}>
                        Approver Details
                    </Typography>

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, mb: 2 }}>
                        {[
                            { label: "Admin", value: selectedRow?.admin },
                            { label: "Technician", value: selectedRow?.technician },
                            { label: "Status", value: selectedRow?.status },
                        ].map(({ label, value }) => (
                            <Box key={label}>
                                <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.3 }}>{label}</Typography>
                                {
                                    value ? <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}>{value}</Typography>
                                        : <TextField
                                            placeholder={`Enter ${label}`}
                                            size="small"
                                            sx={{
                                                mb: 2.5,
                                                "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: 13 },
                                            }}
                                        />
                                }

                            </Box>
                        ))}
                    </Box>

                    {/* Issue Description */}
                    <Box sx={{ bgcolor: "#f5f7fa", borderRadius: 2, px: 2, py: 1.5, mb: 1.5 }}>
                        <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.3 }}>Issue Description</Typography>
                        <Typography sx={{ fontSize: 13, color: "text.primary" }}>{selectedRow?.description || "—"}</Typography>
                    </Box>

                    {/* Admin Remarks (read-only, shown if exists)
            {selectedRow?.adminRemarks && (
              <Box sx={{ bgcolor: "#f5f7fa", borderRadius: 2, px: 2, py: 1.5, mb: 2 }}>
                <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.3 }}>Previous Admin Remarks</Typography>
                <Typography sx={{ fontSize: 13, color: "text.primary" }}>{selectedRow.adminRemarks}</Typography>
              </Box>
            )} */}

                    <Divider sx={{ my: 2 }} />

                    {/* Section 3 — Remarks */}
                    <Typography variant="subtitle2" sx={{ color: "#1e3a5f", fontWeight: 700, mb: 1, textTransform: "uppercase", letterSpacing: 0.8, fontSize: 11 }}>
                        Remarks
                    </Typography>

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Enter your remarks here..."
                        size="small"
                        sx={{
                            mb: 2.5,
                            "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: 13 },
                        }}
                    />

                    {/* Action Buttons */}
                    <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
                        {getActionButtons(selectedRow?.status).map(({ label, color, bg, border, value }) => (
                            <Button
                                key={label}
                                variant="contained"
                                size="small"
                                onClick={() => handleAction(value)}
                                sx={{
                                    bgcolor: bg, color,
                                    border: `1px solid ${border}`,
                                    boxShadow: "none", fontWeight: 600, fontSize: 12,
                                    borderRadius: 2, textTransform: "none", px: 2.5,
                                    "&:hover": { bgcolor: border, boxShadow: "none" },
                                }}
                            >
                                {label}
                            </Button>
                        ))}
                    </Box>

                </Box>
            </Box>
        </Modal>
    </>
    )
}


export default AdminViewModal;